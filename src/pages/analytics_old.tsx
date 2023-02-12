import { ArrowRightIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';

import LoadingSpinner from '../components/LoadingSpinner';
import OrderProductChart from '../components/OrderProductChartEx';
// import OrderProductChart from '../components/OrderProductChart';
import Layout from '../layouts/Layout';
import { db } from '../lib/api/firebase';
import { getDocuments } from '../lib/api/service';
// import { getDocuments } from '../lib/api/service';
import { CupTotal, OrderDetails, OrderStatus } from '../types';
import {
  formatPrice,
  getPrettyName, // getPrettyName,
  orderedProductsToString,
  sortOrders,
} from '../utils';
import type { NextPageWithLayout } from './_app';

const Analytics: NextPageWithLayout = () => {
  const [customerOrders, setCustomerOrders] = useState(null);
  const [reports, setReports] = useState(null);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    getDocuments('menu').then((documents) =>
      setMenu(
        documents.sort((a, b) => a.prettyName.localeCompare(b.prettyName))
      )
    );
  }, []);

  useEffect(() => {
    const orderCollectionRef = collection(db, 'orders');
    const startDay = moment().startOf('day').valueOf();

    const q = query(orderCollectionRef, where('orderTimestamp', '>', startDay));
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

      setReports(fetchedOrders);

      fetchedOrders = fetchedOrders.filter(
        (x) => x.orderStatus === OrderStatus.COMPLETED
      );
      setCustomerOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, []);

  const generateReport = (orders: OrderDetails[]) => {
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
      filename: `${moment().format('MMDDYYYY')}_NK_Daily_Report.csv`,
      headers: headers,
      data: report,
    };

    return csvReport;
  };

  const calculateCups = (orders: OrderDetails[]): CupTotal => {
    const totalRegularCups = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productSize === 'REGULAR')
      // use this filter for the meantime
      .filter((p) => p.productName !== 'GRILLED_4_CHEESE')
      .reduce((total, item) => item.productCount + total, 0)
      .value();

    const totalLargeCups = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productSize === 'LARGE')
      .reduce((total, item) => item.productCount + total, 0)
      .value();

    const totalSnacks = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      // use this filter for the meantime
      .filter((p) => p.productName === 'GRILLED_4_CHEESE')
      .reduce((total, item) => item.productCount + total, 0)
      .value();

    const totalCups = totalRegularCups + totalLargeCups;

    return {
      total: totalCups,
      regular: totalRegularCups,
      large: totalLargeCups,
      snacks: totalSnacks,
    };
  };

  const calculateSales = (orders: OrderDetails[]): CupTotal => {
    const totalSalesForRegular = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productSize === 'REGULAR')
      // use this filter for the meantime
      .filter((p) => p.productName !== 'GRILLED_4_CHEESE')
      .reduce((total, item) => item.productCost + total, 0)
      .value();

    const totalSalesForLarge = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      .filter((p) => p.productSize === 'LARGE')
      .reduce((total, item) => item.productCost + total, 0)
      .value();

    const totalSnacks = _.chain(orders)
      .map((o) => o.orderedProducts)
      .flatten()
      // use this filter for the meantime
      .filter((p) => p.productName === 'GRILLED_4_CHEESE')
      .reduce((total, item) => item.productCost + total, 0)
      .value();

    const totalSales = totalSalesForRegular + totalSalesForLarge + totalSnacks;

    return {
      total: totalSales,
      regular: totalSalesForRegular,
      large: totalSalesForLarge,
      snacks: totalSnacks,
    };
  };

  const cups = useMemo(
    () => customerOrders && calculateCups(customerOrders),
    [customerOrders]
  );

  const sales = useMemo(
    () => customerOrders && calculateSales(customerOrders),
    [customerOrders]
  );

  const report = useMemo(() => reports && generateReport(reports), [reports]);

  const cupsChartData = useMemo(() => {
    const regularCupsChart = _.chain(customerOrders)
      .map((o) => o.orderedProducts)
      .flatten()
      // use this filter for the meantime
      .filter((p) => p.productName !== 'GRILLED_4_CHEESE')
      .filter((p) => p.productSize === 'REGULAR')
      .groupBy('productName')
      .map((array, key) => ({
        name: getPrettyName(key, menu),
        count: _.sumBy(array, 'productCount'),
      }))
      .value();

    const largeCupsChart = _.chain(customerOrders)
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
      regularCupsData: regularCupsChart,
      largeCupsData: largeCupsChart,
      totalRegularCups: cups?.regular,
      totalLargeCups: cups?.large,
    };
  }, [cups, customerOrders, menu]);

  const cupSizes = ['Regular', 'Large'];

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
          <Text fontSize="xs">TOTAL CUPS</Text>
          <Flex align="center" justify="space-between" w="full">
            <Heading size="4xl" fontFamily="body" textAlign="center">
              {cups?.total}
            </Heading>
            <ArrowRightIcon
              transform={cups?.total >= 50 ? 'rotate(-90deg)' : 'rotate(90deg)'}
              boxSize={7}
              color={cups?.total >= 50 ? 'green' : 'red.500'}
            />
          </Flex>

          <Flex
            py={1}
            flexFlow="row wrap"
            justifyContent="space-between"
            w="full"
            gap={2}
          >
            <Stack direction="row" align="start" spacing={1}>
              <Badge bg="nk_orange" pt="2px">
                R
              </Badge>
              <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
              <Badge bg="white" pt="2px">
                {cups?.regular}
              </Badge>
            </Stack>
            <Stack direction="row" align="center" spacing={1}>
              <Badge bg="nk_orange" pt="2px">
                S
              </Badge>
              <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
              <Badge bg="white" pt="2px">
                {cups?.snacks}
              </Badge>
            </Stack>
            <Stack direction="row" align="center" spacing={1}>
              <Badge bg="nk_orange" pt="2px">
                L
              </Badge>
              <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
              <Badge bg="white" pt="2px">
                {cups?.large}
              </Badge>
            </Stack>
          </Flex>
        </Box>
        <Box
          pt={4}
          px={3}
          as={Flex}
          flexDir="column"
          align="start"
          bg="nk_orange"
          borderRadius={30}
          boxShadow="sm"
        >
          <Text fontSize="xs">TOTAL SALES</Text>
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
              <Badge bg="nk_black" color="nk_orange" pt="2px">
                R
              </Badge>
              <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
              <Badge bg="white" color="nk_orange" pt="2px">
                {formatPrice(sales?.regular)}
              </Badge>
            </Stack>

            <Stack
              direction="row"
              align="center"
              justify="left"
              w="full"
              spacing={1}
            >
              <Badge bg="nk_black" color="nk_orange" pt="2px">
                L
              </Badge>
              <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
              <Badge bg="white" color="nk_orange" pt="2px">
                {formatPrice(sales?.large)}
              </Badge>
            </Stack>

            <Stack
              direction="row"
              align="center"
              justify="left"
              w="full"
              spacing={1}
            >
              <Badge bg="nk_black" color="nk_orange" pt="2px">
                S
              </Badge>
              <TriangleUpIcon transform="rotate(90deg)" boxSize={3} />
              <Badge bg="white" color="nk_orange" pt="2px">
                {formatPrice(sales?.snacks)}
              </Badge>
            </Stack>
          </Flex>
        </Box>
      </SimpleGrid>
      <Tabs variant="soft-rounded" size="md" align="center" h="full">
        <TabList>
          {cupSizes.map((size, i) => (
            <Tab
              key={size}
              fontWeight="300"
              _selected={{
                bg: i % 2 === 0 ? 'nk_orange' : 'nk_black',
                color: 'white',
              }}
            >
              {size}
            </Tab>
          ))}
        </TabList>

        <OrderProductChart cupsChartData={cupsChartData} />
      </Tabs>
      <Box as={Flex} justify="center" align="center">
        <Button
          colorScheme="green"
          fontWeight={500}
          borderRadius={15}
          my={5}
          visibility={customerOrders.length === 0 ? 'hidden' : 'visible'}
        >
          <CSVLink {...report}>Generate Report</CSVLink>
        </Button>
      </Box>
    </Box>
  ) : (
    <LoadingSpinner />
  );
};

export default Analytics;

Analytics.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight>{page}</Layout>;
};
