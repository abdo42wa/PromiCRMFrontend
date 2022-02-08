import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNonStandartOrders, updateOrder, createNonStandartOrder, updateNonStandartOrder, addOrder } from '../../appStore/actions/ordersAction'
import {updateManyMaterials} from '../../appStore/actions/productMaterials'
import { Table, Space, Card, Typography, Col, Row, Button, Tag, Image, Select, Input, Checkbox, Tabs } from 'antd'
import { tableCardStyle, tableCardBodyStyle, buttonStyle } from '../../styles/customStyles.js';
import AddOrderComponent from './AddOrderComponent';
import UpdateOrderComponent from './UpdateOrderComponent';
import { getUsers } from '../../appStore/actions/userListActions'
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import AddOrderMaterialsComponent from './addMaterials/AddOrderMaterialsComponent';
import '../../styles/orders.css'

const { Option } = Select;
const selectOptionStyle = {
    width: '90px'
}
function NonStandartOrdersComponent(props) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [addOrderVisibility, setAddOrderVisibility] = useState(false)
    const [updateOrderModal, setUpdateOrderModal] = useState({
        visibility: false,
        record: null
    })
    const [addOrderMaterialsModal, setAddOrderMaterialsModal] = useState({
        visibility: false,
        record: null
    })
    const usersReducer = useSelector((state) => state.usersReducer)
    const productsReducer = useSelector((state) => state.productsReducer)
    const orderReducer = useSelector((state) => state.orderReducer)
    const usersListReducer = useSelector((state) => state.usersListReducer)
    const warehouseReducer = useSelector((state) => state.warehouseReducer)
    const productMaterialsReducer = useSelector((state) => state.productMaterialsReducer)

    //For AddMaterialsComponent
    const showAddMaterialsModal = (record) => {
        setAddOrderMaterialsModal(prevState => ({
            ...prevState,
            visibility: true,
            record: record
        }))
    }
    const unshowAddMaterialsModal = () => {
        setAddOrderMaterialsModal(prevState => ({
            ...prevState,
            visibility: false,
            record: null
        }))
    }
    const saveAddOrderMaterials = (postObj) => {
        dispatch(updateManyMaterials(postObj))
        unshowAddMaterialsModal()
    }

    //For AddOrderComponent
    const showAddOrderModal = () => {
        setAddOrderVisibility(true)
    }
    const unshowAddOrderModal = () => {
        setAddOrderVisibility(false)
    }
    const saveAddOrder = (postObj) => {
        dispatch(createNonStandartOrder(postObj))
        unshowAddOrderModal();
    }
    const showUpdateOrderModal = (record) => {
        setUpdateOrderModal(prevState => ({
            ...prevState,
            visibility: true,
            record: record
        }))
    }
    const unshowUpdateOrderModal = () => {
        setUpdateOrderModal(prevState => ({
            ...prevState,
            visibility: false,
            record: null
        }))
    }
    const updateOrderSave = (postObj, reducerObj) => {
        dispatch(updateOrder(postObj, reducerObj))
        unshowUpdateOrderModal()
    }
    const onDataChange = (record, inputName, value) => {

    }
    useEffect(() => {
        if (usersReducer.currentUser !== null) {
            dispatch(getUsers())
            dispatch(getNonStandartOrders())
        } else {
            history.push('/login')
        }
    }, [usersReducer.currentUser])
    const columns = [
        {
            title: 'Atnaujinti',
            width: '10%',
            render: (text, record, index) => (
                <div style={{ display: 'flex' }}>
                    <Button onClick={(e) => showUpdateOrderModal(record)}>Atnaujinti</Button>
                    {/* {record.orderType === "Ne-standartinis" ?
                        <Button onClick={(e) => showAddMaterialsModal(record)}>Pridėti medžiagas</Button> : null} */}
                </div>

            )
        },
        {
            title: 'Pridėti produktus',
            width: '5%',
            render: (text, record, index) => (
                <Button onClick={(e) => this.addProductsForOrder(record.id)}>Pridėti</Button>
            )
        },
        {
            title: 'Atsakingas asmuo',
            dataIndex: 'user',
            width: '10%',
            render: (text, record, index) => (
                <Typography.Text>{text === null ? '' : text.name}</Typography.Text>
            )
        },
        {
            title: 'Užsakymo tipas',
            dataIndex: 'orderType',
            width: '10%'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: '10%',
            render: (text, record, index) => (
                //<Typography.Text>{text === false ? <Tag className='Neatlikta'>Neatlikta</Tag> : <Tag className='atlikta'>Atlikta</Tag>}</Typography.Text>
                <Typography.Text>{text === false ? <Tag className='Neatlikta'>Neatlikta</Tag> : <Tag className='atlikta'>Atlikta</Tag>}</Typography.Text>
            )
        },
        {
            title: 'Foto',
            dataIndex: 'product',
            width: '10%',
            render: (text, record, index) => {
                if (text === null || text === undefined) {
                    if (record.imagePath === undefined || record.imagePath === null) {
                        return (<p></p>)
                    } else {
                        return (<Image src={record.imagePath} alt='Foto' />)
                    }
                } else {
                    if (text.imagePath === null)
                        return (<p></p>)
                    else
                        return (<Image src={text.imagePath} alt='Foto' />)
                }

            }
        },
        {
            title: 'Užsakymo numeris',
            dataIndex: 'orderNumber',
            width: '10%'
        },
        {
            title: 'Data',
            dataIndex: 'date',
            width: '10%',
            render: (text, record, index) => (
                <p>{moment(text).format('YYYY/MM/DD')}</p>
            )
        },
        {
            title: 'Platforma',
            dataIndex: 'platforma',
            width: '10%'
        },
        {
            title: 'Daugiau informacijos',
            dataIndex: 'moreInfo',
            width: '10%'
        },
        {
            title: 'Kiekis',
            dataIndex: 'quantity',
            width: '10%'
        },
        {
            title: 'Prekės kodas',
            dataIndex: 'productCode',
            width: '10%'
        },
        {
            title: 'Siuntos tipas',
            dataIndex: 'shipment',
            width: '10%',
            render: (text, record, index) => (
                <Typography.Text>{text === null ? '' : text.type}</Typography.Text>
            )
        },
        {
            title: 'Klientas',
            dataIndex: 'customer',
            width: '10%',
            render: (text, record, index) => (
                <Typography.Text>{text === null ? '' : text.name}</Typography.Text>
            )
        }

        , {
            title: 'Gamybos laikas',
            dataIndex: 'productionTime',
            width: '10%'
        },
        {
            title: 'Adresas',
            dataIndex: 'address',
            width: '10%'
        },
        {
            title: 'Lazeriavimas',
            dataIndex: 'orderServices',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null) {
                    let lService = text.find(x => x.orderId === record.id && x.serviceId === 1)
                    if (lService !== null && lService !== undefined)
                        return (
                            <div style={{ display: 'flex' }}>
                                <Select
                                    disabled={record.warehouseProductsNumber !== 0 ? true : record.milingTime === 0 ? true : false}
                                    style={{ ...selectOptionStyle }}
                                    optionFilterProp="children"
                                // onChange={(e) => this.onDataChange(record, "milingUserId", e, "milingComplete")}
                                // defaultValue={text}
                                >
                                    {usersListReducer.users.map((element, index) => {
                                        return (<Option key={element.id} value={element.id}>{element.name} </Option>)
                                    })}
                                </Select>
                                {/* if record doesnt have product its Not-standart work. then display time from Order obj */}
                                <div>
                                    <div className='order-times' ><p>{lService.timeConsumption} min</p></div>
                                </div>
                            </div>
                        )
                    else
                        return (<div>
                            <div className='order-times'><Typography.Text>0 min</Typography.Text></div>
                        </div>)
                }
            }
        },
        {
            title: 'Frezavimas',
            dataIndex: 'orderServices',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null) {
                    let lService = text.find(x => x.orderId === record.id && x.serviceId === 2)
                    if (lService !== null && lService !== undefined)
                        return (
                            <div style={{ display: 'flex' }}>
                                <Select
                                    disabled={record.warehouseProductsNumber !== 0 ? true : record.milingTime === 0 ? true : false}
                                    style={{ ...selectOptionStyle }}
                                    optionFilterProp="children"
                                // onChange={(e) => this.onDataChange(record, "milingUserId", e, "milingComplete")}
                                // defaultValue={text}
                                >
                                    {usersListReducer.users.map((element, index) => {
                                        return (<Option key={element.id} value={element.id}>{element.name} </Option>)
                                    })}
                                </Select>
                                {/* if record doesnt have product its Not-standart work. then display time from Order obj */}
                                <div>
                                    <div className='order-times' ><p>{lService.timeConsumption} min</p></div>
                                </div>
                            </div>
                        )
                    else
                        return (<div>
                            <div className='order-times'><Typography.Text>0 min</Typography.Text></div>
                        </div>)
                }
            }
        },
        {
            title: 'Dažymas',
            dataIndex: 'orderServices',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null) {
                    let lService = text.find(x => x.orderId === record.id && x.serviceId === 3)
                    if (lService !== null && lService !== undefined)
                        return (
                            <div style={{ display: 'flex' }}>
                                <Select
                                    disabled={record.warehouseProductsNumber !== 0 ? true : record.milingTime === 0 ? true : false}
                                    style={{ ...selectOptionStyle }}
                                    optionFilterProp="children"
                                // onChange={(e) => this.onDataChange(record, "milingUserId", e, "milingComplete")}
                                // defaultValue={text}
                                >
                                    {usersListReducer.users.map((element, index) => {
                                        return (<Option key={element.id} value={element.id}>{element.name} </Option>)
                                    })}
                                </Select>
                                {/* if record doesnt have product its Not-standart work. then display time from Order obj */}
                                <div>
                                    <div className='order-times' ><p>{lService.timeConsumption} min</p></div>
                                </div>
                            </div>
                        )
                    else
                        return (<div>
                            <div className='order-times'><Typography.Text>0 min</Typography.Text></div>
                        </div>)
                }
            }
        },
        {
            title: 'Šlifavimas',
            dataIndex: 'orderServices',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null) {
                    let lService = text.find(x => x.orderId === record.id && x.serviceId === 4)
                    if (lService !== null && lService !== undefined)
                        return (
                            <div style={{ display: 'flex' }}>
                                <Select
                                    disabled={record.warehouseProductsNumber !== 0 ? true : record.milingTime === 0 ? true : false}
                                    style={{ ...selectOptionStyle }}
                                    optionFilterProp="children"
                                // onChange={(e) => this.onDataChange(record, "milingUserId", e, "milingComplete")}
                                // defaultValue={text}
                                >
                                    {usersListReducer.users.map((element, index) => {
                                        return (<Option key={element.id} value={element.id}>{element.name} </Option>)
                                    })}
                                </Select>
                                {/* if record doesnt have product its Not-standart work. then display time from Order obj */}
                                <div>
                                    <div className='order-times' ><p>{lService.timeConsumption} min</p></div>
                                </div>
                            </div>
                        )
                    else
                        return (<div>
                            <div className='order-times'><Typography.Text>0 min</Typography.Text></div>
                        </div>)
                }
            }
        },
        {
            title: 'Suklijavimas',
            dataIndex: 'orderServices',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null) {
                    let lService = text.find(x => x.orderId === record.id && x.serviceId === 5)
                    if (lService !== null && lService !== undefined)
                        return (
                            <div style={{ display: 'flex' }}>
                                <Select
                                    disabled={record.warehouseProductsNumber !== 0 ? true : record.milingTime === 0 ? true : false}
                                    style={{ ...selectOptionStyle }}
                                    optionFilterProp="children"
                                // onChange={(e) => this.onDataChange(record, "milingUserId", e, "milingComplete")}
                                // defaultValue={text}
                                >
                                    {usersListReducer.users.map((element, index) => {
                                        return (<Option key={element.id} value={element.id}>{element.name} </Option>)
                                    })}
                                </Select>
                                {/* if record doesnt have product its Not-standart work. then display time from Order obj */}
                                <div>
                                    <div className='order-times' ><p>{lService.timeConsumption} min</p></div>
                                </div>
                            </div>
                        )
                    else
                        return (<div>
                            <div className='order-times'><Typography.Text>0 min</Typography.Text></div>
                        </div>)
                }
            }
        },
        {
            title: 'Surinkimas',
            dataIndex: 'orderServices',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null) {
                    let lService = text.find(x => x.orderId === record.id && x.serviceId === 6)
                    if (lService !== null && lService !== undefined)
                        return (
                            <div style={{ display: 'flex' }}>
                                <Select
                                    disabled={record.warehouseProductsNumber !== 0 ? true : record.milingTime === 0 ? true : false}
                                    style={{ ...selectOptionStyle }}
                                    optionFilterProp="children"
                                // onChange={(e) => this.onDataChange(record, "milingUserId", e, "milingComplete")}
                                // defaultValue={text}
                                >
                                    {usersListReducer.users.map((element, index) => {
                                        return (<Option key={element.id} value={element.id}>{element.name} </Option>)
                                    })}
                                </Select>
                                {/* if record doesnt have product its Not-standart work. then display time from Order obj */}
                                <div>
                                    <div className='order-times' ><p>{lService.timeConsumption} min</p></div>
                                </div>
                            </div>
                        )
                    else
                        return (<div>
                            <div className='order-times'><Typography.Text>0 min</Typography.Text></div>
                        </div>)
                }
            }
        },
        {
            title: 'Pakavimas',
            dataIndex: 'orderServices',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null) {
                    let lService = text.find(x => x.orderId === record.id && x.serviceId === 7)
                    if (lService !== null && lService !== undefined)
                        return (
                            <div style={{ display: 'flex' }}>
                                <Select
                                    disabled={record.warehouseProductsNumber !== 0 ? true : record.milingTime === 0 ? true : false}
                                    style={{ ...selectOptionStyle }}
                                    optionFilterProp="children"
                                // onChange={(e) => this.onDataChange(record, "milingUserId", e, "milingComplete")}
                                // defaultValue={text}
                                >
                                    {usersListReducer.users.map((element, index) => {
                                        return (<Option key={element.id} value={element.id}>{element.name} </Option>)
                                    })}
                                </Select>
                                {/* if record doesnt have product its Not-standart work. then display time from Order obj */}
                                <div>
                                    <div className='order-times' ><p>{lService.timeConsumption} min</p></div>
                                </div>
                            </div>
                        )
                    else
                        return (<div>
                            <div className='order-times'><Typography.Text>0 min</Typography.Text></div>
                        </div>)
                }
            }
        },
        {
            title: 'Šalis',
            dataIndex: 'country',
            width: '10%',
            render: (text, record, index) => (
                <Typography.Text>{text === null ? '' : text.name}</Typography.Text>
            )
        },
        {
            title: 'Komentaras',
            dataIndex: 'comment',
            width: '10%'
        },
        {
            title: 'Kaina',
            dataIndex: 'price',
            width: '10%'
        },
        {
            title: 'Valiuta',
            dataIndex: 'currencyName',
            width: '10%',
            render: (text, record, index) => (
                <Typography.Text>{text}</Typography.Text>
            )
        },
        {
            title: 'VAT',
            dataIndex: 'vat',
            width: '10%'
        },
        {
            title: 'Užsakymo pabaigos data',
            dataIndex: 'orderFinishDate',
            width: '10%',
            render: (text, record, index) => (
                <p>{moment(text).format('YYYY/MM/DD')}</p>
            )
        },
    ]
    return <>
        <div>
            <Row gutter={16}>
                <Col span={16}>
                    <div style={{ marginRight: '40px', textAlign: 'start' }}>
                        <Typography.Title>Ne-standartiniai Užsakymai</Typography.Title>
                        <Typography.Text>Pridėkite ir atnaujinkite ne-standartinius užsakymus</Typography.Text>
                    </div>
                </Col>
            </Row>
            <div style={{ padding: '15px' }}></div>
            <Row gutter={16}>
                <Col span={24}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={orderReducer.non_standart_orders}
                        pagination={{ pageSize: 15 }}
                        bordered
                        scroll={{ x: 'calc(1200px + 50%)' }}
                        footer={() => (<Space style={{ display: 'flex', justifyContent: 'space-between' }}><Button size="large" style={{ ...buttonStyle }} onClick={(e) => showAddOrderModal()}>Pridėti užsakymą</Button></Space>)}
                    />
                </Col>
            </Row>
        </div>
        {addOrderVisibility !== false ?
            <AddOrderComponent visible={addOrderVisibility} save={saveAddOrder}
                onClose={unshowAddOrderModal}
            />
            : null}
        {updateOrderModal.visibility !== false ?
            <UpdateOrderComponent visible={updateOrderModal.visibility}
                record={updateOrderModal.record}
                save={updateOrderSave} onClose={unshowUpdateOrderModal} /> :
            null}

        {addOrderMaterialsModal.visibility !== false ?
            <AddOrderMaterialsComponent visible={addOrderMaterialsModal.visibility}
                onClose={unshowAddMaterialsModal} record={addOrderMaterialsModal.record}
                save={saveAddOrderMaterials} /> : null}

    </>;
}

export default NonStandartOrdersComponent;