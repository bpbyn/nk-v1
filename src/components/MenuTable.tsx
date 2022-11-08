import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { OrderMenuProps } from '../types';
import { filterMenu } from '../utils';
import LoadingSpinner from './LoadingSpinner';
import MenuCards from './MenuCards';
import MenuCart from './MenuCart';

const MenuTable: React.FC<OrderMenuProps> = ({ menu }) => {
  const menuItems = ['Coffee', 'Non Coffee', 'Snacks'];

  return (
    <Tabs variant="soft-rounded" h="full" p={{ base: '5', lg: '10' }}>
      <TabList>
        {menuItems.map((item) => (
          <Tab
            fontWeight={100}
            key={item}
            _selected={{ bg: 'nk_orange', color: 'white' }}
          >
            {item}
          </Tab>
        ))}
      </TabList>
      {menu ? (
        <TabPanels>
          {menu &&
            menuItems.map((item) => (
              <TabPanel key={item} px={0}>
                <MenuCards menu={filterMenu(menu, item)} />
                <MenuCart />
              </TabPanel>
            ))}
        </TabPanels>
      ) : (
        <LoadingSpinner />
      )}
    </Tabs>
  );
};

export default MenuTable;
