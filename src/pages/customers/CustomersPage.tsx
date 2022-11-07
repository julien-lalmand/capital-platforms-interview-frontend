import { Button, Divider, Group, Paper, Table, Title, Text, Center, Modal, Space } from "@mantine/core";
import { useEffect, useState } from "react";
import { showNotification } from '@mantine/notifications';
import Customer from "../../domain/Customer";
import CustomersRepository from "../../repositories/CustomersRepository";
import { IconEdit, IconTrash } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import CpApiErrorResponse from "../../models/CpApiErrorResponse";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Array<Customer>>();
    const [error, setError] = useState<any>();
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [selectedCustomerIdForDelete, setSelectedCustomerIdForDelete] = useState<number>();

    let navigate = useNavigate();

    let repository = new CustomersRepository();
    repository.getAll();

    const getAll = async () => {
        let customers = await repository.getAll();
        if (customers instanceof Array<Customer>) {
            setCustomers(customers as Array<Customer>);
        } else {
            setError(customers);
        }
    };

    const deleteCustomer = async (id: number) => {
        await repository.delete(id)
            .then((result) => {
                getAll();
                showNotification({
                    color: "green",
                    title: 'Success',
                    message: 'Customer was deleted.',
                })
            })
            .catch((error) => {
                showNotification({
                    color: "red",
                    title: 'Something went wrong',
                    message: (error.response.data as CpApiErrorResponse).detail,
                })
            })
            .finally(() => {
                setDeleteModalOpened(false);
            });
    }

    useEffect(() => {
        getAll();
    }, []);

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

    return (
        <section>
            <Paper p={30} radius={20} shadow={"sm"}>
                <Group position="apart">
                    <Title>Customers</Title>
                    <Button onClick={() => navigate("/Customers/Create")}>New Customer</Button>
                </Group>
                <Divider mt={15} mb={30} />
                <Table highlightOnHover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Email</th>
                            <th>Consultant</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            customers?.map((customer) => {
                                return (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.firstName}</td>
                                        <td>{customer.lastName}</td>
                                        <td>{customer.emailAddress}</td>
                                        <td>{customer.consultant?.firstName} {customer.consultant?.lastName}</td>
                                        <td>
                                            <Group position="center" spacing={"xs"}>
                                                <Button size={"xs"} onClick={() => { navigate(`/Customers/${customer.id}`) }}><IconEdit size={18} /></Button>
                                                <Button size={"xs"} onClick={() => { setDeleteModalOpened(true); setSelectedCustomerIdForDelete(customer.id) }} color={"red"}><IconTrash size={18} /></Button>
                                            </Group>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Paper>
            <Modal
                centered
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title="Warning"
            >
                <Text>Are you sure you want to delete customer {customers?.filter(c => c.id === selectedCustomerIdForDelete)[0]?.emailAddress} ?</Text>
                <Space h="xl" />
                <Group>
                    <Button color="red" onClick={() => { if(selectedCustomerIdForDelete !== undefined) deleteCustomer(selectedCustomerIdForDelete)} }>Yes</Button>
                    <Button onClick={() => {setDeleteModalOpened(false)}}>No</Button>
                </Group>
            </Modal>
        </section>
    );
}
