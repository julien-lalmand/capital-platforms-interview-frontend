import { Button, Divider, Group, Paper, Table, Title, Text, Center, Modal, Space } from "@mantine/core";
import { useEffect, useState } from "react";
import { showNotification } from '@mantine/notifications';
import Consultant from "../../domain/Consultant";
import ConsultantsRepository from "../../repositories/ConsultantsRepository";
import { IconEdit, IconTrash } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import CpApiErrorResponse from "../../models/CpApiErrorResponse";

export default function ConsultantsPage() {
    const [consultants, setConsultants] = useState<Array<Consultant>>();
    const [error, setError] = useState<any>();
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [selectedConsultantIdForDelete, setSelectedConsultantIdForDelete] = useState<number>();

    let navigate = useNavigate();

    let repository = new ConsultantsRepository();
    repository.getAll();

    const getAll = async () => {
        let consultants = await repository.getAll();
        if (consultants instanceof Array<Consultant>) {
            setConsultants(consultants as Array<Consultant>);
        } else {
            setError(consultants);
        }
    };

    const deleteConsultant = async (id: number) => {
        await repository.delete(id)
            .then((result) => {
                getAll();
                showNotification({
                    color: "green",
                    title: 'Success',
                    message: 'Consultant was deleted.',
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
                    <Title>Consultants</Title>
                    <Button onClick={() => navigate("/Consultants/Create")}>New Consultant</Button>
                </Group>
                <Divider mt={15} mb={30} />
                <Table highlightOnHover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Email</th>
                            <th>Mobile No</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            consultants?.map((consultant) => {
                                return (
                                    <tr key={consultant.id}>
                                        <td>{consultant.id}</td>
                                        <td>{consultant.firstName}</td>
                                        <td>{consultant.lastName}</td>
                                        <td>{consultant.emailAddress}</td>
                                        <td>{consultant.mobileNo}</td>
                                        <td>
                                            <Group position="center" spacing={"xs"}>
                                                <Button size={"xs"} onClick={() => { navigate(`/Consultants/${consultant.id}`) }}><IconEdit size={18} /></Button>
                                                <Button size={"xs"} onClick={() => { setDeleteModalOpened(true); setSelectedConsultantIdForDelete(consultant.id) }} color={"red"}><IconTrash size={18} /></Button>
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
                <Text>Are you sure you want to delete consultant {consultants?.filter(c => c.id === selectedConsultantIdForDelete)[0]?.emailAddress} ?</Text>
                <Space h="xl" />
                <Group>
                    <Button color="red" onClick={() => { if(selectedConsultantIdForDelete !== undefined) deleteConsultant(selectedConsultantIdForDelete)} }>Yes</Button>
                    <Button onClick={() => {setDeleteModalOpened(false)}}>No</Button>
                </Group>
            </Modal>
        </section>
    );
}
