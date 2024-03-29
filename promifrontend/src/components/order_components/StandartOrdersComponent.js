import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getOrders, addOrderWarehouse, updateStandartOrWarehouseComplete, addOrderService, updateOrderService } from '../../appStore/actions/ordersAction'
import { checkWarehouseProduct, createOrUpdateWarehouseData } from '../../appStore/actions/warehouseActions'
import { Table, Space, Card, Typography, Col, Row, Button, Tag, Image, Select, Input, Checkbox, Tabs } from 'antd'
import { buttonStyle } from '../../styles/customStyles.js';
import AddOrderComponent from './AddOrderComponent';
import UpdateOrderComponent from './UpdateOrderComponent';
import { getProducts } from '../../appStore/actions/productsActions'
import { getUsers } from '../../appStore/actions/userListActions'
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import AddOrderMaterialsComponent from './addMaterials/AddOrderMaterialsComponent';
import '../../styles/orders.css'

const { Option } = Select;
const selectOptionStyle = {
    width: '90px'
}
function StandartOrdersComponent(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [duplicateNumbers, setDuplicateNumbers] = useState([])
    const [addOrderVisiblity, setAddOrderVisibility] = useState(false)
    const [updateOrderModal, setUpdateOrderModal] = useState({
        visibility: false,
        record: null
    })
    const usersReducer = useSelector((state) => state.usersReducer)
    const productsReducer = useSelector((state) => state.productsReducer)
    const orderReducer = useSelector((state) => state.orderReducer)
    const usersListReducer = useSelector((state) => state.usersListReducer)
    const warehouseReducer = useSelector((state) => state.warehouseReducer)
    const productMaterialsReducer = useSelector((state) => state.productMaterialsReducer)


    const showAddOrderModal = () => {
        setAddOrderVisibility(true)
    }
    const unshowAddOrderModal = () => {
        setAddOrderVisibility(false)
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

    const getDuplicatesOrderNumber = () => {
        const arry = orderReducer.orders.map((x) => x.orderNumber)
        const toFindDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) !== index)
        const duplicateElementa = toFindDuplicates(arry);
        setDuplicateNumbers(duplicateElementa);
    }

    const onPackingComplete = (userId, orderServiceId, order) => {
        console.log('heheh')
        const u_services = [
            {
                "userId": userId,
                "orderServiceId": orderServiceId,
                "orderId": order.id,
                "completionDate": moment().format('YYYY/MM/DD,h:mm:ss a')
            }
        ]
        const { id, ...obj } = order;
        const postObj = {
            ...obj,
            "status": true,
            "completionDate": moment().format('YYYY/MM/DD,h:mm:ss a'),
            "userServices": u_services
        }
        // 
        //but in reducer it is better to pass all userServices with new Packing service too
        const reducerObj = {
            ...order,
            "status": true,
            "completionDate": moment().format('YYYY/MM/DD,h:mm:ss a')
        };
        if (order.orderType === "Standartinis") {
            dispatch(updateStandartOrWarehouseComplete(postObj, reducerObj))
        } else if (order.orderType === "Sandelis") {
            const warehouseCountingPostObj = {
                "orderId": reducerObj.id,
                "quantityProductWarehouse": reducerObj.quantity,
                "lastTimeChanging": moment().format('YYYY/MM/DD,h:mm:ss a'),
                "productCode": reducerObj.productCode
            }
            dispatch(updateStandartOrWarehouseComplete(postObj, reducerObj))
            dispatch(createOrUpdateWarehouseData(warehouseCountingPostObj))
        }
    }

    const onDataChange = (userService, userId, orderServiceId, record) => {
        if (userService === undefined || userService === null) {
            const postObj = {
                "userId": userId,
                "orderServiceId": orderServiceId,
                "orderId": record.id,
                "completionDate": moment().format('YYYY/MM/DD,h:mm:ss a')
            }
            dispatch(addOrderService(postObj))
        } else {
            const { id, ...obj } = userService;
            const postObj = {
                ...obj,
                "userId": userId,
                "completionDate": moment().format('YYYY/MM/DD,h:mm:ss a'),
            }
            const reducerObj = {
                ...postObj,
                "id": userService.id
            }
            dispatch(updateOrderService(postObj, reducerObj))
        }

    }

    useEffect(() => {
        if (usersReducer.currentUser !== null) {
            dispatch(getUsers())
            dispatch(getOrders())
            getDuplicatesOrderNumber();
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
        // {
        //     title: 'Pridėti produktus',
        //     width: '5%',
        //     render: (text, record, index) => (
        //         <Button onClick={(e) => this.addProductsForOrder(record.id)}>Pridėti</Button>
        //     )
        // },
        {
            title: 'Pasiėmėte iš sandėlio?',
            dataIndex: 'warehouseProductsTaken',
            width: '10%',
            render: (text, record, index) => {
                if (record.status === false && record.warehouseProductsNumber !== 0) {
                    //onChange={(e) => this.getProductsFromWarehouse(e.target.checked, "warehouseProductsTaken", record)}
                    return (<div style={{ display: 'flex' }}>
                        <Input type={'checkbox'} style={{ width: '35px', height: '35px' }} disabled={text === true ? true : false} value={text} />
                        <Typography.Text style={{ paddingLeft: '15px', fontSize: '20px' }}> ({record.warehouseProductsNumber})</Typography.Text>
                    </div>)
                } else if (record.status === true && record.warehouseProductsNumber !== 0) {
                    return (<div style={{ display: 'flex' }}>
                        <Input type={'checkbox'} style={{ width: '35px', height: '35px' }} disabled={text === true ? true : false} value={text} />
                        <Typography.Text style={{ paddingLeft: '15px', fontSize: '20px' }}> ({record.warehouseProductsNumber})</Typography.Text>
                    </div>)
                }
            }
        },
        {
            title: 'Atsakingas asmuo',
            dataIndex: 'user',
            width: '10%',
            render: (text, record, index) => (
                <p>{text === null ? '' : text.name}</p>
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
                <p>{text === false ? <Tag className='Neatlikta'>Neatlikta</Tag> : <Tag className='atlikta'>Atlikta</Tag>}</p>
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
            width: '10%',
            render: (text, record, index) => (
                <p>{duplicateNumbers.includes(text) === true ? <p className='duplicate'>{text}</p> : <p>{text}</p>}</p>
            )
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
                <p>{text === null ? '' : text.type}</p>
            )
        },
        {
            title: 'Klientas',
            dataIndex: 'customer',
            width: '10%',
            render: (text, record, index) => (
                <p>{text === null ? '' : text.name}</p>
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
            dataIndex: 'product',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null && text.orderServices !== undefined && text.orderServices !== null) {
                    //find frezavimas orderService
                    let lService = text.orderServices.find(x => x.serviceId === 1)
                    // find this particular order userService by orderid. and orderServiceId
                    let userService = lService !== undefined && lService !== null ? record.userServices.find(x => x.orderServiceId === lService.id) : null
                    return (
                        <div>
                            {lService !== null && lService !== undefined ?
                                <div style={{ display: 'flex' }}>
                                    <Select
                                        disabled={lService.timeConsumption === 0 ? true : record.warehouseProductsTaken === true ? true : false}
                                        style={{ ...selectOptionStyle }}
                                        optionFilterProp="children"
                                        defaultValue={userService !== null && userService !== undefined ? userService.userId : null}
                                        value={userService !== null && userService !== undefined ? userService.userId : null}
                                        onChange={(e) => onDataChange(userService, e, lService.id, record)}
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
                                :
                                <div>
                                    <div className='order-times' ><Typography.Text>0 min</Typography.Text></div>
                                </div>

                            }
                        </div>
                    )
                }
            }
        },
        {
            title: 'Frezavimas',
            dataIndex: 'product',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null && text.orderServices !== undefined && text.orderServices !== null) {
                    //find frezavimas orderService
                    let lService = text.orderServices.find(x => x.serviceId === 2)
                    let userService = lService !== undefined && lService !== null ? record.userServices.find(x => x.orderServiceId === lService.id) : null
                    return (
                        <div>
                            {lService !== null && lService !== undefined ?
                                <div style={{ display: 'flex' }}>
                                    <Select
                                        disabled={lService.timeConsumption === 0 ? true : record.warehouseProductsTaken === true ? true : false}
                                        style={{ ...selectOptionStyle }}
                                        optionFilterProp="children"
                                        defaultValue={userService !== null && userService !== undefined ? userService.userId : null}
                                        value={userService !== null && userService !== undefined ? userService.userId : null}
                                        onChange={(e) => onDataChange(userService, e, lService.id, record)}
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
                                :
                                <div>
                                    <div className='order-times' ><Typography.Text>0 min</Typography.Text></div>
                                </div>

                            }
                        </div>
                    )
                }
            }
        },
        {
            title: 'Dažymas',
            dataIndex: 'product',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null && text.orderServices !== undefined && text.orderServices !== null) {
                    //find frezavimas orderService
                    let lService = text.orderServices.find(x => x.serviceId === 3)
                    let userService = lService !== undefined && lService !== null ? record.userServices.find(x => x.orderServiceId === lService.id) : null
                    return (
                        <div>
                            {lService !== null && lService !== undefined ?
                                <div style={{ display: 'flex' }}>
                                    <Select
                                        disabled={lService.timeConsumption === 0 ? true : record.warehouseProductsTaken === true ? true : false}
                                        style={{ ...selectOptionStyle }}
                                        optionFilterProp="children"
                                        defaultValue={userService !== null && userService !== undefined ? userService.userId : null}
                                        value={userService !== null && userService !== undefined ? userService.userId : null}
                                        onChange={(e) => onDataChange(userService, e, lService.id, record)}
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
                                :
                                <div>
                                    <div className='order-times' ><Typography.Text>0 min</Typography.Text></div>
                                </div>

                            }
                        </div>
                    )
                }
            }
        },
        {
            title: 'Šlifavimas',
            dataIndex: 'product',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null && text.orderServices !== undefined && text.orderServices !== null) {
                    //find frezavimas orderService
                    let lService = text.orderServices.find(x => x.serviceId === 4)
                    let userService = lService !== undefined && lService !== null ? record.userServices.find(x => x.orderServiceId === lService.id) : null
                    return (
                        <div>
                            {lService !== null && lService !== undefined ?
                                <div style={{ display: 'flex' }}>
                                    <Select
                                        disabled={lService.timeConsumption === 0 ? true : record.warehouseProductsTaken === true ? true : false}
                                        style={{ ...selectOptionStyle }}
                                        optionFilterProp="children"
                                        defaultValue={userService !== null && userService !== undefined ? userService.userId : null}
                                        value={userService !== null && userService !== undefined ? userService.userId : null}
                                        onChange={(e) => onDataChange(userService, e, lService.id, record)}
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
                                :
                                <div>
                                    <div className='order-times' ><Typography.Text>0 min</Typography.Text></div>
                                </div>

                            }
                        </div>
                    )
                }
            }
        },
        {
            title: 'Suklijavimas',
            dataIndex: 'product',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null && text.orderServices !== undefined && text.orderServices !== null) {
                    //find frezavimas orderService
                    let lService = text.orderServices.find(x => x.serviceId === 5)
                    let userService = lService !== undefined && lService !== null ? record.userServices.find(x => x.orderServiceId === lService.id) : null
                    return (
                        <div>
                            {lService !== null && lService !== undefined ?
                                <div style={{ display: 'flex' }}>
                                    <Select
                                        disabled={lService.timeConsumption === 0 ? true : record.warehouseProductsTaken === true ? true : false}
                                        style={{ ...selectOptionStyle }}
                                        optionFilterProp="children"
                                        defaultValue={userService !== null && userService !== undefined ? userService.userId : null}
                                        value={userService !== null && userService !== undefined ? userService.userId : null}
                                        onChange={(e) => onDataChange(userService, e, lService.id, record)}
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
                                :
                                <div>
                                    <div className='order-times' ><Typography.Text>0 min</Typography.Text></div>
                                </div>

                            }
                        </div>
                    )
                }
            }
        },
        {
            title: 'Surinkimas',
            dataIndex: 'product',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null && text.orderServices !== undefined && text.orderServices !== null) {
                    //find frezavimas orderService
                    let lService = text.orderServices.find(x => x.serviceId === 6)
                    let userService = lService !== undefined && lService !== null ? record.userServices.find(x => x.orderServiceId === lService.id) : null
                    return (
                        <div>
                            {lService !== null && lService !== undefined ?
                                <div style={{ display: 'flex' }}>
                                    <Select
                                        disabled={lService.timeConsumption === 0 ? true : record.warehouseProductsTaken === true ? true : false}
                                        style={{ ...selectOptionStyle }}
                                        optionFilterProp="children"
                                        defaultValue={userService !== null && userService !== undefined ? userService.userId : null}
                                        value={userService !== null && userService !== undefined ? userService.userId : null}
                                        onChange={(e) => onDataChange(userService, e, lService.id, record)}
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
                                :
                                <div>
                                    <div className='order-times' ><Typography.Text>0 min</Typography.Text></div>
                                </div>

                            }
                        </div>
                    )
                }
            }
        },
        {
            title: 'Pakavimas',
            dataIndex: 'product',
            width: '10%',
            render: (text, record, index) => {
                if (text !== undefined && text !== null && text.orderServices !== undefined && text.orderServices !== null) {
                    //find frezavimas orderService
                    let lService = text.orderServices.find(x => x.serviceId === 7)
                    let userService = lService !== undefined && lService !== null ? record.userServices.find(x => x.orderServiceId === lService.id) : null
                    return (
                        <div>
                            {lService !== null && lService !== undefined ?
                                <div style={{ display: 'flex' }}>
                                    <Select
                                        disabled={userService !== undefined && userService !== null && userService.userId !== null ? true : record.warehouseProductsTaken === true ? true : false}
                                        style={{ ...selectOptionStyle }}
                                        optionFilterProp="children"
                                        defaultValue={userService !== null && userService !== undefined ? userService.userId : null}
                                        value={userService !== null && userService !== undefined ? userService.userId : null}
                                        onChange={(e) => onPackingComplete(e, lService.id, record)}
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
                                :
                                <div>
                                    <div className='order-times' ><Typography.Text>0 min</Typography.Text></div>
                                </div>

                            }
                        </div>
                    )
                }
            }
        },
        {
            title: 'Šalis',
            dataIndex: 'country',
            width: '10%',
            render: (text, record, index) => (
                <p>{text === null ? '' : text.name}</p>
            )
        },
        {
            title: 'ES/NE ES',
            dataIndex: 'country',
            width: '10%',
            render: (text, record, index) => (
                <p>{text === null || record.orderType === "Sandelis" ? '' : text.continent === "Europe" ? "ES" : text.continent !== "Europe" ? "NE ES" : ""}</p>
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
            width: '10%'
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
        {
            title: ' Uzsakovo vardas',
            dataIndex: 'customerName',
            width: '10%'
        },
        {
            title: 'Siuntimo kaina',
            dataIndex: 'shippingCost',
            width: '10%'
        },
        {
            title: 'Siuntos numeris',
            dataIndex: 'shippingNumber',
            width: '10%'
        }
    ]
    return <>
        <div>
            <Row gutter={16}>
                <Col span={16}>
                    <div style={{ marginRight: '40px', textAlign: 'start' }}>
                        <Typography.Title>Užsakymai</Typography.Title>
                        <Typography.Text>Pridėkite ir atnaujinkite užsakymus</Typography.Text>
                    </div>
                </Col>
            </Row>
            <div style={{ padding: '15px' }}></div>
            <Row gutter={16}>
                <Col span={24}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={orderReducer.orders}
                        pagination={{ pageSize: 15 }}
                        bordered
                        scroll={{ x: 'calc(1200px + 50%)' }}
                        footer={() => (<Space style={{ display: 'flex', justifyContent: 'space-between' }}><Button size="large" style={{ ...buttonStyle }} onClick={(e) => showAddOrderModal()}>Pridėti užsakymą</Button></Space>)}
                    />
                </Col>
            </Row>
        </div>
        {addOrderVisiblity !== false ?
            <AddOrderComponent visible={addOrderVisiblity}
                onClose={unshowAddOrderModal}
            />
            : null}
        {updateOrderModal.visibility !== false ?
            <UpdateOrderComponent visible={updateOrderModal.visibility}
                record={updateOrderModal.record}
                onClose={unshowUpdateOrderModal}
            /> :
            null}
        {/* saveWithImg={updateOrderWithImg} */}

        {/* {this.state.addOrderMaterials.visibility !== false ?
            <AddOrderMaterialsComponent visible={this.state.addOrderMaterials.visibility}
                onClose={this.unshowAddMaterialsModal} record={this.state.addOrderMaterials.record}
                save={this.saveAddOrderMaterials} /> : null} */}

    </>;
}

export default StandartOrdersComponent;
