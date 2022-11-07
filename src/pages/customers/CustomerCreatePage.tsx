import { Center, Title, Text, Paper, Group, Button, Divider, Stack, NumberInput, TextInput, NativeSelect } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Customer from '../../domain/Customer';
import CpApiErrorResponse from '../../models/CpApiErrorResponse';
import CustomersRepository from '../../repositories/CustomersRepository';
import Consultant from '../../domain/Consultant';
import ConsultantsRepository from '../../repositories/ConsultantsRepository';

export default function CustomerCreatePage() {
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<Customer>(new Customer());
    const [consultants, setConsultants] = useState<Consultant[]>();

    const [error, setError] = useState<CpApiErrorResponse>();

    let repository = new CustomersRepository();
    let consultantsRepository = new ConsultantsRepository();

    const getAllConsultants = async() => {
        consultantsRepository.getAll()
        .then((result) => {
            setConsultants(result as Consultant[]);
        })
        .catch((error) => {
            setError(error.response.data);
        });
    }

    useEffect(() => {
        getAllConsultants();
    }, []);


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

    const form = useForm({
        validate: {
            //email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const handleChange = (e: any) => {
        setCustomer((prevalue: any) => {
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

    const handleConsultantChange = (e: any) => {
        console.log(e.target.value);
        console.log(consultants);
        setCustomer((prevalue: any) => {
            return {
                ...prevalue,
                ["consultantId"]: e.target.value
            }      
        })
        console.log(customer);
    }

    const createCustomer = async () => {
        console.log(customer);
        repository.create(customer as Customer)
        .then((result) => {
            showNotification({
                color: "green",
                title: 'Success',
                message: 'Customer was created.',
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


    return customer !== undefined && consultants !== undefined ? (
        <section>
            <Paper p={30} radius={20} shadow={"sm"}>
                <Group position="apart">
                    <Title>New Customer</Title>
                </Group>
                <Divider mt={15} mb={30} />
                <form onSubmit={form.onSubmit(createCustomer)}>
                    <TextInput label="First Name" name="firstName" {...form.getInputProps('name')} onChange={handleChange} value={customer?.firstName} required/>
                    <TextInput label="Last Name" name="lastName" {...form.getInputProps('name')} onChange={handleChange} value={customer?.lastName} required/>
                    <TextInput label="Address" name="address" {...form.getInputProps('name')} onChange={handleChange} value={customer?.address} />
                    <TextInput label="Gender" name="gender" {...form.getInputProps('name')} onChange={handleChange} value={customer?.gender} />
                    <DatePicker label="Date of Birth" name="dob" value={customer?.dob} onChange={(e) => {console.log(e)}} />
                    <TextInput label="Mobile Number" name="mobileNo" {...form.getInputProps('name')} onChange={handleChange} value={customer?.mobileNo} />
                    <TextInput mt="sm" label="Email" name="emailAddress" placeholder="Email" {...form.getInputProps('email')} onChange={handleChange} value={customer?.emailAddress} pattern="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/" required/>
                    <NativeSelect
                        name="consultant"
                        data={ consultants.map(c =>{  return ( { value: c.id.toString(), label: c.emailAddress } )})}
                        label="Associated consultant"
                        onChange={handleConsultantChange}
                        required
                    />
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
