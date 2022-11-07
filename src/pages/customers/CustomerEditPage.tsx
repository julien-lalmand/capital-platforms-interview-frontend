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

export default function CustomerEditPage() {
    const navigate = useNavigate();
    const id = useParams().id;

    if (id === undefined) navigate("/NotFound");

    const [customer, setCustomer] = useState<Customer>();
    const [consultants, setConsultants] = useState<Consultant[]>();

    const [error, setError] = useState<CpApiErrorResponse>();

    let repository = new CustomersRepository();
    let consultantsRepository = new ConsultantsRepository();


    const get = async () => {
        let customer = repository.get(parseInt(id as string))
        .then((customer) => {
            setCustomer(customer as Customer);
        })
        .catch(error => {
            setError(error.response.data);
        });

    };

    const getAllConsultants = async() => {
        consultantsRepository.getAll()
        .then((result) => {
            setConsultants(result as Consultant[]);
            console.log((result as Consultant[]).map(c => c.emailAddress));
        })
        .catch((error) => {
            setError(error.response.data);
        });
    }

    useEffect(() => {
        get();
        getAllConsultants();
    }, []);

    const form = useForm({
        validate: (values) => ({
            //email: (value: string) => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ? null : 'Invalid email'),
        }),
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
        setCustomer((prevalue: any) => {
            return {
                ...prevalue,
                ["consultant"]: consultants?.filter(c => c.id === parseInt(e.target.value))[0]
            }      
        })
    }

    const handleDateChange = (e: Date) => {
        setCustomer((prevalue: any) => {
            return {
                ...prevalue,
                ["dob"]: e
            }      
        })
    }

    const updateCustomer = async () => {
        repository.update(customer as Customer)
        .then((result) => {
            showNotification({
                color: "green",
                title: 'Success',
                message: 'Customer was updated.',
              })
        })
        .catch((error) => {
            console.log(error)
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

    return customer !== undefined && consultants !== undefined ? (
        <section>
            <Paper p={30} radius={20} shadow={"sm"}>
                <Group position="apart">
                    <Title>{customer?.firstName + ' ' + customer?.lastName}</Title>
                </Group>
                <Divider mt={15} mb={30} />
                <form onSubmit={form.onSubmit(updateCustomer)}>
                    <TextInput label="First Name" name="firstName" onChange={handleChange} value={customer?.firstName} required/>
                    <TextInput label="Last Name" name="lastName" onChange={handleChange} value={customer?.lastName} required/>
                    <TextInput label="Address" name="address"  onChange={handleChange} value={customer?.address} />
                    <TextInput label="Gender" name="gender"  onChange={handleChange} value={customer?.gender} />
                    <DatePicker label="Date of Birth" name="dob" value={new Date(customer?.dob)} onChange={handleDateChange} />
                    <TextInput label="Mobile Number" name="mobileNo" onChange={handleChange} value={customer?.mobileNo} />
                    <TextInput mt="sm" label="Email" name="emailAddress" placeholder="Email" {...form.getInputProps('email')} onChange={handleChange} value={customer?.emailAddress} required />
                    <NativeSelect
                        name="consultant"
                        data={ consultants.map(c =>{  return ( { value: c.id.toString(), label: c.emailAddress } )})}
                        label="Associated consultant"
                        value={customer.consultant.id}
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
