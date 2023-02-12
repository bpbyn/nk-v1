import { ArrowRightIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  keyframes,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import 'react-datepicker/dist/react-datepicker.css';
import { TbReportSearch } from 'react-icons/tb';

import LoadingSpinner from '../components/LoadingSpinner';
import OrderProductChart from '../components/OrderProductChart';
import TableDatePicker from '../components/TableDatePicker';
import Layout from '../layouts/Layout';
import { db } from '../lib/api/firebase';
import { getDocuments, getDocumentsWithQuery } from '../lib/api/service';
import { ChartDetails, OrderDetails, OrderStatus } from '../types';
import {
  formatPrice,
  getPrettyName,
  orderedProductsToString,
  sortOrders,
} from '../utils';
import type { NextPageWithLayout } from './_app';

const animation = keyframes`
    0% {
      box-shadow: 0 5px 15px 0px rgba(0,0,0,0);
      transform: translatey(0px);
    }
    50% {
      box-shadow: 0 25px 15px 0px rgba(0,0,0,0.2);
      transform: translatey(-6px);
    }
    100% {
      box-shadow: 0 5px 15px 0px rgba(0,0,0,0);
      transform: translatey(0px);
    }
  `;

const Analytics: NextPageWithLayout = () => {
  const [customerOrders, setCustomerOrders] = useState(null);
  const [loader, setLoader] = useState(false);
  const [menu, setMenu] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: moment().startOf('day').valueOf(),
    endDate: moment().endOf('day').valueOf(),
  });
  const [reports, setReports] = useState(null);
  const [checkBoxStatus, setCheckBoxStatus] = useState(false);

  useEffect(() => {
    getDocuments('menu').then((documents) =>
      setMenu(
        documents.sort((a, b) => a.prettyName.localeCompare(b.prettyName))
      )
    );
  }, []);

  useEffect(() => {
    setLoader(true);
    const orderCollectionRef = collection(db, 'orders');
    // const q = query(orderCollectionRef, where('orderTimestamp', '>', startDay));
    const q = query(
      orderCollectionRef,
      where('orderTimestamp', '>=', dateRange.startDate),
      where('orderTimestamp', '<=', dateRange.endDate)
    );
    const unsubscribe = onSnapshot(q, (qSnapshots) => {
      let fetchedOrders: OrderDetails[] = [];
      fetchedOrders = qSnapshots.docs.map((doc) => {
        const completeDoc: OrderDetails = {
          id: doc.id,
          customerName: doc.data().customerName,
          orderId: doc.data().orderId,
          orderStatus: doc.data().orderStatus,
          orderNotes: doc.data().orderNotes,
          orderedProducts: doc.data().orderedProducts,
          orderTimestamp: doc.data().orderTimestamp,
        };
        return completeDoc;
      });

      fetchedOrders = sortOrders(fetchedOrders);

      fetchedOrders = fetchedOrders.filter(
        (x) => x.orderStatus === OrderStatus.COMPLETED
      );
      setCustomerOrders(fetchedOrders);
    });

    setLoader(false);
    onClose();

    return () => unsubscribe();
  }, [dateRange, onClose]);

  useEffect(() => {
    if (checkBoxStatus) {
      const orderCollectionRef = collection(db, 'orders');
      const q = query(
        orderCollectionRef,
        where('orderTimestamp', '>=', startDate),
        where('orderTimestamp', '<=', endDate)
      );

      getDocumentsWithQuery(q).then((documents) => {
        if (documents) {
          setReports(handleMakeCSV(documents));
        }
      });
    }
  }, [checkBoxStatus, endDate, startDate]);

  const handleDateChange = (startDate: Date, endDate: Date) => {
    setStartDate(moment(startDate).startOf('day').valueOf());
    setEndDate(moment(endDate).endOf('day').valueOf());
  };

  const handleGenerateReport = () => {
    setDateRange({ startDate: startDate, endDate: endDate });
    setCheckBoxStatus(false);
  };

  const handleMakeCSV = (orders: OrderDetails[]) => {
    const report = [];
    const headers = [
      { label: 'Date', key: 'orderDate' },
      { label: 'Time', key: 'orderTime' },
      { label: 'ID', key: 'orderId' },
      { label: 'Name', key: 'customerName' },
      { label: 'Status', key: 'orderStatus' },
      { label: 'Ordered Products', key: 'orderedProducts' },
      { label: 'Notes', key: 'orderNotes' },
      { label: 'Order Total', key: 'orderTotal' },
    ];

    orders.map((order: OrderDetails) => {
      const customer = {
        orderDate: moment(order.orderTimestamp).format('MM/DD/YYYY'),
        orderTime: moment(order.orderTimestamp).format('hh:mm:ss a'),
        orderId: order.orderId,
        customerName: order.customerName,
        orderStatus: order.orderStatus,
        orderNotes: order.orderNotes,
        orderedProducts: orderedProductsToString(order.orderedProducts),
        orderTotal: order.orderedProducts.reduce(
          (total, item) => item.productCost + total,
          0
        ),
      };

      report.push(customer);
    });

    const csvReport = {
      filename: `${moment().format('MMDDYYYY')}_NK_Report.csv`,
      headers: headers,
      data: report,
    };

    return csvReport;
  };

  const calculateColdCups = (orders: OrderDetails[]) => {
    const totalRegularCups = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productSize === 'REGULAR')
      .filter((p) => p.productType === 'Cold' || p.productType === 'Non_Coffee')
      .reduce((total, item) => item.productCount + total, 0)
      .value();

    const totalLargeCups = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productSize === 'LARGE')
      .filter((p) => p.productType === 'Cold' || p.productType === 'Non_Coffee')
      .reduce((total, item) => item.productCount + total, 0)
      .value();

    const totalCups = totalRegularCups + totalLargeCups;

    return {
      total: totalCups,
      regular: totalRegularCups,
      large: totalLargeCups,
    };
  };

  const calculateHotCups = (orders: OrderDetails[]) => {
    const totalRegularCups = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productSize === 'REGULAR')
      .filter((p) => p.productType === 'Hot')
      .reduce((total, item) => item.productCount + total, 0)
      .value();

    const totalCups = totalRegularCups;

    return {
      total: totalCups,
      regular: totalRegularCups,
    };
  };

  const calculateSnacks = (orders: OrderDetails[]) => {
    const totalSnacks = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productName === 'GRILLED_4_CHEESE')
      .reduce((total, item) => item.productCount + total, 0)
      .value();

    return { total: totalSnacks };
  };

  const calculateSales = (orders: OrderDetails[]) => {
    const totalSalesForColdRegular = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productSize === 'REGULAR')
      .filter((p) => p.productType === 'Cold' || p.productType === 'Non_Coffee')
      .reduce((total, item) => item.productCost + total, 0)
      .value();

    const totalSalesForColdLarge = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productSize === 'LARGE')
      .filter((p) => p.productType === 'Cold' || p.productType === 'Non_Coffee')
      .reduce((total, item) => item.productCost + total, 0)
      .value();

    const totalSalesForHotRegular = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productSize === 'REGULAR')
      .filter((p) => p.productType === 'Hot')
      .reduce((total, item) => item.productCost + total, 0)
      .value();

    const totalSalesForSnacks = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productName === 'GRILLED_4_CHEESE')
      .reduce((total, item) => item.productCost + total, 0)
      .value();

    const totalSales =
      totalSalesForColdRegular +
      totalSalesForColdLarge +
      totalSalesForHotRegular +
      totalSalesForSnacks;

    return {
      total: totalSales,
      coldRegular: totalSalesForColdRegular,
      coldLarge: totalSalesForColdLarge,
      hotRegular: totalSalesForHotRegular,
      snacks: totalSalesForSnacks,
    };
  };

  const hotCups = useMemo(
    () => customerOrders && calculateHotCups(customerOrders),
    [customerOrders]
  );

  const coldCups = useMemo(
    () => customerOrders && calculateColdCups(customerOrders),
    [customerOrders]
  );

  const snacks = useMemo(
    () => customerOrders && calculateSnacks(customerOrders),
    [customerOrders]
  );

  const sales = useMemo(
    () => customerOrders && calculateSales(customerOrders),
    [customerOrders]
  );

  const cupsChartData: ChartDetails = useMemo(() => {
    const coldCupsChart = _.chain(customerOrders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productSize === 'REGULAR')
      .filter((p) => p.productType === 'Cold' || p.productType === 'Non_Coffee')
      .groupBy('productName')
      .map((array, key) => ({
        name: getPrettyName(key, menu),
        count: _.sumBy(array, 'productCount'),
      }))
      .value();

    const hotCupsChart = _.chain(customerOrders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productSize === 'LARGE')
      .groupBy('productName')
      .map((array, key) => ({
        name: getPrettyName(key, menu),
        count: _.sumBy(array, 'productCount'),
      }))
      .value();

    return {
      coldCupsData: coldCupsChart,
      hotCupsData: hotCupsChart,
      totalColdCups: coldCups?.total,
      totalHotCups: hotCups?.total,
    };
  }, [coldCups?.total, customerOrders, hotCups?.total, menu]);

  const cupTemp = ['Hot', 'Cold'];

  const floatAnimation = `${animation} 3s ease-in-out infinite`;

  return customerOrders ? (
    <Box p={{ base: 3, md: 5 }} as={Flex} flexFlow="column" gap={10} h="full">
      <SimpleGrid columns={2} spacing={5} minChildWidth="145px" color="white">
        <Box
          p={5}
          as={Flex}
          flexDir="column"
          align="start"
          bg="nk_black"
          borderRadius={30}
          boxShadow="sm"
        >
          <Text fontSize="xs">TOTAL CUPS ❄️</Text>
          <Flex align="center" justify="space-between" w="full">
            <Heading size="4xl" fontFamily="body" textAlign="center">
              {coldCups?.total}
            </Heading>
            <ArrowRightIcon
              transform={
                coldCups?.total >= 100 ? 'rotate(-90deg)' : 'rotate(90deg)'
              }
              boxSize={7}
              color={coldCups?.total >= 100 ? 'green' : 'red.500'}
            />
          </Flex>

          <Flex py={1} flexFlow="column wrap" w="full" gap={2}>
            <Stack direction="row" align="center" spacing={1}>
              <Badge bg="nk_orange" pt="2px">
                ❄️R
              </Badge>
              <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
              <Badge bg="white" pt="2px">
                {coldCups?.regular}
              </Badge>
            </Stack>
            <Stack direction="row" align="center" spacing={1}>
              <Badge bg="nk_orange" pt="2px">
                ❄️L
              </Badge>
              <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
              <Badge bg="white" pt="2px">
                {coldCups?.large}
              </Badge>
            </Stack>
          </Flex>
        </Box>
        <Box
          p={5}
          as={Flex}
          flexDir="column"
          align="start"
          bg="nk_orange"
          borderRadius={30}
          boxShadow="sm"
        >
          <Text fontSize="xs">TOTAL CUPS 🔥</Text>
          <Flex align="center" justify="space-between" w="full">
            <Heading size="4xl" fontFamily="body" textAlign="center">
              {hotCups?.total}
            </Heading>
            <ArrowRightIcon
              transform={
                hotCups?.total >= 50 ? 'rotate(-90deg)' : 'rotate(90deg)'
              }
              boxSize={7}
              color={hotCups?.total >= 50 ? 'green' : 'red.500'}
            />
          </Flex>

          <Flex
            py={1}
            flexFlow="row wrap"
            justifyContent="space-between"
            w="full"
            gap={2}
          >
            <Stack direction="row" align="center" spacing={1}>
              <Badge bg="nk_black" color="nk_orange" pt="2px">
                🔥
              </Badge>
              <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
              <Badge bg="white" pt="2px">
                {hotCups?.regular}
              </Badge>
            </Stack>
          </Flex>
        </Box>
        <Box
          p={5}
          as={Flex}
          flexDir="column"
          align="space-between"
          bg="nk_orange"
          borderRadius={30}
          boxShadow="sm"
        >
          <Box>
            <Text fontSize="xs">TOTAL SNACKS 🥪</Text>
            <Flex align="center" justify="space-between" w="full">
              <Heading size="4xl" fontFamily="body" textAlign="center">
                {snacks?.total}
              </Heading>
              <ArrowRightIcon
                transform={
                  snacks?.total >= 5 ? 'rotate(-90deg)' : 'rotate(90deg)'
                }
                boxSize={7}
                color={snacks?.total >= 5 ? 'green' : 'red.500'}
              />
            </Flex>
          </Box>
          <Box pt={2}>
            <Flex
              py={1}
              flexFlow="row wrap"
              justifyContent="space-between"
              w="full"
              gap={2}
            >
              <Stack direction="row" align="center" spacing={1}>
                <Badge bg="nk_black" color="nk_orange" pt="2px">
                  🥪
                </Badge>
                <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
                <Badge bg="white" pt="2px">
                  {formatPrice(sales?.snacks)}
                </Badge>
              </Stack>
            </Flex>
          </Box>
        </Box>
        <Box
          p={5}
          as={Flex}
          flexDir="column"
          align="start"
          bg="nk_black"
          borderRadius={30}
          boxShadow="sm"
        >
          <Text fontSize="xs">TOTAL SALES ❄️🔥🥪</Text>
          <Flex align="center" justify="space-between" w="full">
            <Heading size="lg" fontFamily="body" textAlign="center">
              {formatPrice(sales?.total)}
            </Heading>
            <ArrowRightIcon
              transform={
                sales?.total >= 5000 ? 'rotate(-90deg)' : 'rotate(90deg)'
              }
              color={sales?.total >= 5000 ? 'green' : 'red.500'}
              boxSize={4}
            />
          </Flex>
          <Flex py={1} flexFlow="row wrap" w="full" gap={2}>
            <Stack
              direction="row"
              align="center"
              justify="left"
              w="full"
              spacing={1}
            >
              <Badge bg="nk_orange" color="nk_black" pt="2px" w="2rem">
                ❄️R
              </Badge>
              <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
              <Badge bg="white" color="nk_black" pt="2px">
                {formatPrice(sales?.coldRegular)}
              </Badge>
            </Stack>
            <Stack
              direction="row"
              align="center"
              justify="left"
              w="full"
              spacing={1}
            >
              <Badge bg="nk_orange" color="nk_black" pt="2px" w="2rem">
                ❄️L
              </Badge>
              <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
              <Badge bg="white" color="nk_black" pt="2px">
                {formatPrice(sales?.coldLarge)}
              </Badge>
            </Stack>
            <Stack
              direction="row"
              align="center"
              justify="left"
              w="full"
              spacing={1}
            >
              <Badge
                bg="nk_orange"
                color="nk_black"
                pt="2px"
                w="2rem"
                textAlign="center"
              >
                🔥
              </Badge>
              <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
              <Badge bg="white" color="nk_black" pt="2px">
                {formatPrice(sales?.hotRegular)}
              </Badge>
            </Stack>
          </Flex>
        </Box>
      </SimpleGrid>
      <Tabs variant="soft-rounded" size="md" align="center" h="full">
        <TabList>
          {cupTemp.map((temp, i) => (
            <Tab
              key={temp}
              fontWeight="300"
              _selected={{
                bg: i % 2 === 0 ? 'nk_orange' : 'nk_black',
                color: 'white',
              }}
            >
              {temp}
            </Tab>
          ))}
        </TabList>
        <OrderProductChart cupsChartData={cupsChartData} />
      </Tabs>
      <Box position="absolute" bottom={5} right={5} zIndex={2} margin="auto">
        <IconButton
          colorScheme="orange"
          bg="nk_orange"
          aria-label="Select Date Range"
          borderRadius={100}
          icon={<TbReportSearch />}
          animation={floatAnimation}
          onClick={onOpen}
        />
      </Box>
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader bg="nk_orange" color="white">
            <Flex justify="space-between" align="center">
              <Text letterSpacing={3}>GENERATE REPORT</Text>
              <DrawerCloseButton position="unset" />
            </Flex>
          </DrawerHeader>

          <DrawerBody
            bg="nk_lightOrange"
            as={Flex}
            flexDir="column"
            alignItems="center"
          >
            <Text as="b">Please select a date: </Text>
            <Box>
              <TableDatePicker onSelectedDateChange={handleDateChange} />
            </Box>
            <Checkbox
              colorScheme="green"
              mt={6}
              onChange={(e) => setCheckBoxStatus(e.target.checked)}
            >
              <Text>Generate CSV</Text>
            </Checkbox>
          </DrawerBody>

          <DrawerFooter bg="nk_lightOrange" justifyContent="center">
            <Button
              colorScheme="orange"
              bg="nk_orange"
              fontWeight={500}
              borderRadius={15}
              isLoading={loader}
              onClick={() => handleGenerateReport()}
              isDisabled={!startDate && !endDate}
            >
              {checkBoxStatus && reports ? (
                <CSVLink {...reports}>GENERATE</CSVLink>
              ) : (
                'GENERATE'
              )}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  ) : (
    <LoadingSpinner />
  );
};

export default Analytics;

Analytics.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight>{page}</Layout>;
};
