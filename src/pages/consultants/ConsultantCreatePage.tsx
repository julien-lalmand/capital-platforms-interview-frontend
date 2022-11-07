import { Center, Title, Text, Paper, Group, Button, Divider, Stack, NumberInput, TextInput, NativeSelect } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Consultant from '../../domain/Consultant';
import CpApiErrorResponse from '../../models/CpApiErrorResponse';
import ConsultantsRepository from '../../repositories/ConsultantsRepository';

export default function ConsultantCreatePage() {
    const navigate = useNavigate();

    const [consultant, setConsultant] = useState<Consultant>(new Consultant());

    const [error, setError] = useState<CpApiErrorResponse>();

    let repository = new ConsultantsRepository();
    let consultantsRepository = new ConsultantsRepository();


    useEffect(() => {
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
        setConsultant((prevalue: any) => {
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
        setConsultant((prevalue: any) => {
            return {
                ...prevalue,
                ["consultantId"]: e.target.value
            }      
        })
    }

    const createConsultant = async () => {
        repository.create(consultant as Consultant)
        .then((result) => {
            showNotification({
                color: "green",
                title: 'Success',
                message: 'Consultant was created.',
              })
              navigate("/Consultants");
        })
        .catch((error) => {
            console.log((error.response.data as CpApiErrorResponse))
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
                <Center>
                    <Title>Something went wrong...</Title>
                    <Text>{error}</Text>
                </Center>
            </section>
        )
    }

    return consultant !== undefined ? (
        <section>
            <Paper p={30} radius={20} shadow={"sm"}>
                <Group position="apart">
                    <Title>New Consultant</Title>
                </Group>
                <Divider mt={15} mb={30} />
                <form onSubmit={form.onSubmit(createConsultant)}>
                    <TextInput label="First Name" name="firstName" {...form.getInputProps('name')} onChange={handleChange} value={consultant?.firstName} required />
                    <TextInput label="Last Name" name="lastName" {...form.getInputProps('name')} onChange={handleChange} value={consultant?.lastName} required />
                    <TextInput label="Mobile Number" name="mobileNo" {...form.getInputProps('name')} onChange={handleChange} value={consultant?.mobileNo} />
                    <TextInput mt="sm" label="Email" name="emailAddress" placeholder="Email" {...form.getInputProps('email')} onChange={handleChange} value={consultant?.emailAddress} required/>
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
