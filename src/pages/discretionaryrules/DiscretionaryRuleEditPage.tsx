import { Center, Title, Text, Paper, Group, Button, Divider, Stack, NumberInput, TextInput, Checkbox } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DiscretionaryRule from '../../domain/DiscretionaryRule';
import CpApiErrorResponse from '../../models/CpApiErrorResponse';
import DiscretionaryRulesRepository from '../../repositories/DiscretionaryRulesRepository';

export default function DiscretionaryRuleEditPage() {
    const navigate = useNavigate();
    const id = useParams().id;

    if (id === undefined) navigate("/NotFound");

    const [discretionaryRule, setDiscretionaryRule] = useState<DiscretionaryRule>();

    const [error, setError] = useState<CpApiErrorResponse>();

    let repository = new DiscretionaryRulesRepository();

    const get = async () => {
        repository.get(parseInt(id as string))
        .then((discretionaryRule) => {
            setDiscretionaryRule(discretionaryRule as DiscretionaryRule);
        })
        .catch(error => {
            setError(error.response.data);
        });
    };

    useEffect(() => {
        get();
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

    const updateDiscretionaryRule = async () => {
        repository.update(discretionaryRule as DiscretionaryRule)
        .then((result) => {
            showNotification({
                color: "green",
                title: 'Success',
                message: 'DiscretionaryRule was updated.',
              })
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

    return discretionaryRule !== undefined ? (
        <section>
            <Paper p={30} radius={20} shadow={"sm"}>
                <Group position="apart">
                    <Title>Rule #{discretionaryRule?.id}</Title>
                </Group>
                <Divider mt={15} mb={30} />
                <form onSubmit={form.onSubmit(updateDiscretionaryRule)}>
                    <Text>Customer: {discretionaryRule.customer.emailAddress} ({discretionaryRule.customer.id})</Text>
                    <Text>Consultant: {discretionaryRule.consultant.emailAddress} ({discretionaryRule.consultant.id})</Text>
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
