import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  useNavigate,
  Routes
} from "react-router-dom";
import { AppShell, Container, Header, Navbar, Image, useMantineTheme, Aside, Burger, Footer, MediaQuery, Text, Center, createStyles, Code, Group, Title } from '@mantine/core'
import { IconUsers, IconLicense, IconBuildingSkyscraper, IconHome } from '@tabler/icons';

import ConsultantsPage from './pages/consultants/ConsultantsPage';
import CustomersPage from './pages/customers/CustomersPage';
import DiscretionaryRulesPage from './pages/discretionaryrules/DiscretionaryRulesPage';
import HomePage from './pages/HomePage';
import CustomerEditPage from './pages/customers/CustomerEditPage';
import NotFoundPage from './pages/NotFoundPage';
import CustomerCreatePage from './pages/customers/CustomerCreatePage';
import ConsultantEditPage from './pages/consultants/ConsultantEditPage';
import ConsultantCreatePage from './pages/consultants/ConsultantCreatePage';
import DiscretionaryRuleEditPage from './pages/discretionaryrules/DiscretionaryRuleEditPage';
import DiscretionaryRuleCreatePage from './pages/discretionaryrules/DiscretionaryRuleCreatePage';

function App() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const { classes, cx } = useStyles();
  const [active, setActive] = useState('Consultants');

  let navigate = useNavigate();

  const data = [
    { link: '/Consultants', label: 'Consultants', icon: IconUsers },
    { link: '/Customers', label: 'Customers', icon: IconBuildingSkyscraper },
    { link: '/DiscretionaryRules', label: 'Discretionary Rules', icon: IconLicense },
  ];

  const router = createBrowserRouter([
    {
      path: "",
      element: <HomePage />,
    },
    {
      path: "/NotFound",
      element: <NotFoundPage />,
    },
    {
      path: "/Consultants",
      element: <ConsultantsPage />,
    },
    {
      path: "/Consultants/:id",
      element: <ConsultantEditPage />,
    },
    {
      path: "/Consultants/Create",
      element: <ConsultantCreatePage />,
    },
    {
      path: "/Customers",
      element: <CustomersPage />,
    },
    {
      path: "/Customers/Create",
      element: <CustomerCreatePage />,
    },
    {
      path: "/Customers/:id",
      element: <CustomerEditPage />,
    },
    {
      path: "/DiscretionaryRules",
      element: <DiscretionaryRulesPage />,
    },
    {
      path: "/DiscretionaryRules/:id",
      element: <DiscretionaryRuleEditPage />,
    },
    {
      path: "/DiscretionaryRules/Create",
      element: <DiscretionaryRuleCreatePage />,
    }
  ]);

  const links = data.map((item) => (
      <a
        className={cx(classes.link, { [classes.linkActive]: item.label === active })}
        key={item.label}
        href={item.link}
        onClick={(event) => {
          event.preventDefault();
          setActive(item.label);
          navigate(item.link);
        }}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </a>
  ));


  return (
    <div>
      <AppShell
        styles={{
          main: {
            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 300, lg: 300 }}>
            <Navbar.Section grow>
              <Group className={classes.header} position="apart">
                <Image src="/img/logo.png" height={69} width={270} />
              </Group>
              {links}
            </Navbar.Section>
          </Navbar>
        }
        footer={
          <Footer height={60} p="md">
            <Center><Text>Recruitment Test for Capital Platforms by Julien Lalmand (mail@julienlalmand.com).</Text></Center>
          </Footer>
        }
        header={
          <Header height={{ base: 50, md: 70 }} p="md">
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
            </div>
          </Header>
        }
      >
        <Container size={"xl"}>
          <Routes>
            
            <Route path="/" element={<ConsultantsPage />} />

            <Route path="/Consultants" element={<ConsultantsPage />} />
            <Route path="/Consultants/Create" element={<ConsultantCreatePage />} />
            <Route path="/Consultants/:id" element={<ConsultantEditPage />} />

            <Route path="/Customers" element={<CustomersPage />} />
            <Route path="/Customers/Create" element={<CustomerCreatePage />} />
            <Route path="/Customers/:id" element={<CustomerEditPage />} />

            <Route path="/DiscretionaryRules" element={<DiscretionaryRulesPage />} />
            <Route path="/DiscretionaryRules/Create" element={<DiscretionaryRuleCreatePage />} />
            <Route path="/DiscretionaryRules/:id" element={<DiscretionaryRuleEditPage />} />

            <Route path="/NotFound" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Container>
      </AppShell>
    </div>
  )
}


const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        [`& .${icon}`]: {
          color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
      },
    },
  };
});

export default App
