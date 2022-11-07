import { Button, Divider, Group, Paper, Table, Title, Text, Center, Modal, Space } from "@mantine/core";
import { useEffect, useState } from "react";
import { showNotification } from '@mantine/notifications';
import DiscretionaryRule from "../../domain/DiscretionaryRule";
import DiscretionaryRulesRepository from "../../repositories/DiscretionaryRulesRepository";
import { IconEdit, IconTrash, IconSquareCheck, IconSquare } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import CpApiErrorResponse from "../../models/CpApiErrorResponse";

export default function DiscretionaryRulesPage() {
    const [discretionaryRules, setDiscretionaryRules] = useState<Array<DiscretionaryRule>>();
    const [error, setError] = useState<any>();
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [selectedDiscretionaryRuleIdForDelete, setSelectedDiscretionaryRuleIdForDelete] = useState<number>();

    let navigate = useNavigate();

    let repository = new DiscretionaryRulesRepository();
    repository.getAll();

    const getAll = async () => {
        let discretionaryRules = await repository.getAll();
        if (discretionaryRules instanceof Array<DiscretionaryRule>) {
            setDiscretionaryRules(discretionaryRules as Array<DiscretionaryRule>);
        } else {
            setError(discretionaryRules);
        }
    };

    const deleteDiscretionaryRule = async (id: number) => {
        await repository.delete(id)
            .then((result) => {
                getAll();
                showNotification({
                    color: "green",
                    title: 'Success',
                    message: 'DiscretionaryRule was deleted.',
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
                    <Title>Discretionary Rules</Title>
                    <Button onClick={() => navigate("/DiscretionaryRules/Create")}>New Discretionary Rule</Button>
                </Group>
                <Divider mt={15} mb={30} />
                <Table highlightOnHover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Consultant</th>
                            <th>Consultant Buy</th>
                            <th>Consultant Sell</th>
                            <th>Customer</th>
                            <th>Customer Buy</th>
                            <th>Customer Sell</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            discretionaryRules?.map((discretionaryRule) => {
                                return (
                                    <tr key={discretionaryRule.id}>
                                        <td>{discretionaryRule.id}</td>
                                        <td>{discretionaryRule.consultantId}</td>
                                        <td>{discretionaryRule.consultantBuy ? <IconSquareCheck /> : <IconSquare />}</td>
                                        <td>{discretionaryRule.consultantSell ? <IconSquareCheck /> : <IconSquare />}</td>
                                        <td>{discretionaryRule.customerId}</td>
                                        <td>{discretionaryRule.customerBuy ? <IconSquareCheck /> : <IconSquare />}</td>
                                        <td>{discretionaryRule.customerSell ? <IconSquareCheck /> : <IconSquare />}</td>
                                        <td>
                                            <Group position="center" spacing={"xs"}>
                                                <Button size={"xs"} onClick={() => { navigate(`/DiscretionaryRules/${discretionaryRule.id}`) }}><IconEdit size={18} /></Button>
                                                <Button size={"xs"} onClick={() => { setDeleteModalOpened(true); setSelectedDiscretionaryRuleIdForDelete(discretionaryRule.id) }} color={"red"}><IconTrash size={18} /></Button>
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
                <Text>Are you sure you want to delete discretionaryRule between {discretionaryRules?.filter(c => c.id === selectedDiscretionaryRuleIdForDelete)[0]?.consultantId} and {discretionaryRules?.filter(c => c.id === selectedDiscretionaryRuleIdForDelete)[0]?.customerId}?</Text>
                <Space h="xl" />
                <Group>
                    <Button color="red" onClick={() => { if(selectedDiscretionaryRuleIdForDelete !== undefined) deleteDiscretionaryRule(selectedDiscretionaryRuleIdForDelete)} }>Yes</Button>
                    <Button onClick={() => {setDeleteModalOpened(false)}}>No</Button>
                </Group>
            </Modal>
        </section>
    );
}
