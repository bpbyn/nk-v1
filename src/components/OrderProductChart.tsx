import { Box, Flex, Image, TabPanel, TabPanels, Text } from '@chakra-ui/react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Label,
  Legend,
} from 'recharts';

import { ChartDetails } from '../types';

interface OrderProductChartProps {
  cupsChartData: ChartDetails;
}

const OrderProductChart: React.FC<OrderProductChartProps> = ({
  cupsChartData,
}) => {
  const { regularCupsData, largeCupsData, totalLargeCups, totalRegularCups } =
    cupsChartData;

  const toggleSizeChart = [
    { chartData: regularCupsData, total: totalRegularCups },
    { chartData: largeCupsData, total: totalLargeCups },
  ];

  const COLORS = [
    '#DF8527',
    '#EF7253',
    '#EC697C',
    '#D76C9E',
    '#B476B5',
    '#8D80BC',
    '#6A85B6',
    '#5886A5',
  ];

  return (
    <TabPanels>
      {toggleSizeChart.map(({ chartData, total }, index) => (
        <TabPanel key={index}>
          {total > 0 ? (
            <ResponsiveContainer height={300} width="80%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  fill="#8884d8"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <Label
                    position="center"
                    value={total}
                    fill="#2C303C"
                    style={{ fontSize: '50px' }}
                  />
                </Pie>
                <Tooltip
                  animationEasing="ease-out"
                  contentStyle={{
                    borderRadius: '20px',
                    border: 'none',
                    background: '#DF8527',
                  }}
                  itemStyle={{
                    color: '#FFFFFF',
                    background: '#DF8527',
                  }}
                />
                <Legend
                  iconType="monotone"
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="bottom"
                  align="center"
                  height={50}
                  payload={chartData.map((item, index) => ({
                    id: item.name,
                    value: `${item.count} 👉🏼 ${item.name}`,
                    color: COLORS[index % COLORS.length],
                  }))}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box
              as={Flex}
              flexFlow="column wrap"
              justify="start"
              mt={20}
              alignItems="center"
              h="full"
            >
              <Image
                src="assets/no_data.svg"
                alt="no_data"
                boxSize="200px"
                background="nk_gray.20"
                borderRadius="full"
              />
              <Text color="nk_gray.30" p={5}>
                {`You're All Caught Up For Now 🤭`}
              </Text>
            </Box>
          )}
        </TabPanel>
      ))}
    </TabPanels>
  );
};

export default OrderProductChart;
