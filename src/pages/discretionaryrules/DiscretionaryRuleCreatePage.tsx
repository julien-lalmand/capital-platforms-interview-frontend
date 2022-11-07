import { Center, Title, Text, Paper, Group, Button, Divider, Stack, NumberInput, TextInput, Checkbox, NativeSelect } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DiscretionaryRule from '../../domain/DiscretionaryRule';
import CpApiErrorResponse from '../../models/CpApiErrorResponse';
import DiscretionaryRulesRepository from '../../repositories/DiscretionaryRulesRepository';
import CustomersRepository from '../../repositories/CustomersRepository';
import ConsultantsRepository from '../../repositories/ConsultantsRepository';
import Consultant from '../../domain/Consultant';
import Customer from '../../domain/Customer';

export default function DiscretionaryRuleCreatePage() {
    const navigate = useNavigate();

    const [discretionaryRule, setDiscretionaryRule] = useState<DiscretionaryRule>(new DiscretionaryRule());
    const [consultants, setConsultants] = useState<Array<Consultant>>();
    const [customers, setCustomers] = useState<Array<Customer>>();

    const [error, setError] = useState<CpApiErrorResponse>();

    let repository = new DiscretionaryRulesRepository();
    let customersRepository = new CustomersRepository();
    let consultantsRepository = new ConsultantsRepository();

    const getConsultants = async () => {
        consultantsRepository.getAll()
        .then((consultants) => {
            console.log(consultants)
            setConsultants(consultants as Consultant[]);
        })
        .catch(error => {
            setError(error.response.data);
        });
    }

    const getCustomers = async () => {
        customersRepository.getAll()
        .then((customers) => {
            console.log(customers)
            setCustomers(customers as Customer[]);
        })
        .catch(error => {
            setError(error.response.data);
        });
    }

    useEffect(() => {
        getConsultants();
        getCustomers();
    }, []);


   

    const form = useForm({
        
        //initialValues: { name: discretionaryRule?.firstName, email: discretionaryRule?.emailAddress, age: 0 },
/**
        validate: {
            name: (value: string) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            age: (value) => (value < 18 ? 'You must be at least 18 to &gister' : null),
            mobileNo: (value: any) => (isNaN(value) ? 'Must be a number' : null)
        },
    **/
    });

    const handleChange = (e: any) => {
        setDiscretionaryRule((prevalue: any) => {
            if(e.target.value instanceof Date) {
                return {
                    ...prevalue,
                    ["dob"]: e.target.value
                }   
            } else {
                return {
                    ...prevalue,
                    [e.target.name]: e.target.value
                }   
            }
   
        })
    }

    const handleCheckboxChange = (e: any) => {
        setDiscretionaryRule((prevalue: any) => {
            return {
                ...prevalue,
                [e.target.name]: e.target.checked
            }  
        })
    }

    const createDiscretionaryRule = async () => {
        repository.create(discretionaryRule as DiscretionaryRule)
        .then((result) => {
            showNotification({
                color: "green",
                title: 'Success',
                message: 'DiscretionaryRule was updated.',
              })
              navigate("/DiscretionaryRules");
        })
        .catch((error) => {
            showNotification({
                color: "red",
                title: 'Something went wrong',
                message: (error.response.data as CpApiErrorResponse).detail,
              })
        });
    }

    if (error !== undefined) {
        return (
            <section>
                <Stack>
                    <Title>Something went wrong...</Title>
                    <Text>{error.detail}</Text>
                </Stack>
            </section>
        )
    }

    return consultants !== undefined && customers !== undefined ? (
        <section>
            <Paper p={30} radius={20} shadow={"sm"}>
                <Group position="apart">
                    <Title>Rule #{discretionaryRule?.id}</Title>
                </Group>
                <Divider mt={15} mb={30} />
                <form onSubmit={form.onSubmit(createDiscretionaryRule)}>
                    <NativeSelect
                        name="customerId"
                        data={ customers.map(c =>{  return ( { value: c.id.toString(), label: c.emailAddress } )})}
                        label="Associated Customer"
                        //value={customer.consultant.id}
                        onChange={handleChange}
                    />
                                        <NativeSelect
                        name="consultantId"
                        data={ consultants.map(c =>{  return ( { value: c.id.toString(), label: c.emailAddress } )})}
                        label="Associated Consultant"
                        //value={customer.consultant.id}
                        onChange={handleChange}
                    />
                    <Checkbox label="Customer Buy" checked={discretionaryRule.customerBuy} name="customerBuy" onChange={handleCheckboxChange} />
                    <Checkbox label="Customer Sell" checked={discretionaryRule.customerSell} name="customerSell" onChange={handleCheckboxChange} />
                    <Checkbox label="Consultant Buy" checked={discretionaryRule.consultantBuy} name="consultantBuy" onChange={handleCheckboxChange} />
                    <Checkbox label="Consultant Sell" checked={discretionaryRule.consultantSell} name="consultantSell" onChange={handleCheckboxChange} />

                    <Button type="submit" mt="sm">
                        Submit
                    </Button>
                </form>
            </Paper>
        </section>
    ) : (
        <div>Loading...</div>
    )
}
