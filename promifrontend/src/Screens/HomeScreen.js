import React from 'react'
import { getUsers } from '../Actions/userListActions'
import { Table, Card, Typography, Col, Row, Tag, Checkbox } from 'antd'
import { Image } from 'antd'
import { getOrders, getUncompletedWarehouseOrders, getUncompletedExpressOrders, getOrdersUncompleted, getClientsOrders, getLastWeeksCompletedOrders, getRecentOrders, getLastMonthCompletedOrders, getUrgetOrders } from '../Actions/orderAction'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getWeekWorks, updateWork } from '../Actions/WeeklyWorkScheduleAction'
import { tableCardStyle, tableCardBodyStyle } from '../styles/customStyles.js';
import { getMaterialsWarehouseData } from '../Actions/materialsWarehouseActions';
import { getProducts } from '../Actions/productsActions'
import { getWarehouseProducts } from '../Actions/warehouseActions'
import moment from 'moment';
// import { Chart } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2';
import LastWeeksProducts from '../Components/LastWeeksProducts'
import LastMonthProducts from '../Components/LastMonthProducts'




class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            products: [],
            collectionTime: 0,
            bondingTime: 0,
            laserTime: 0,
            paintingTime: 0,
            milingTime: 0,
            packingTime: 0,
            done: false,
            lastWeeksMadeProducts: [],
            lastMonthMadeProducts: []
        }
    }
    // const dispatch = useDispatch();
    // const usersReducer = useSelector(state => state.usersReducer)
    // const { currentUser } = usersReducer

    getLastWeeksMadeProducts = () => {
        const clone = JSON.parse(JSON.stringify(this.props.orderDetailsReducer.last_weeks_orders));
        console.log('clone' + JSON.stringify(clone))
        const array = []
        for (var i = 0; i < 5; i++) {
            if (clone[i] !== null && clone[i] !== undefined) {
                let quantity = clone[i].quantity;
                for (var a = i + 1; a < clone.length; a++) {
                    if (clone[i].weekNumber === clone[a].weekNumber) {
                        quantity = quantity + clone[a].quantity;
                        var values = clone.findIndex(x => x.id === clone[a].id)
                        clone.splice(values, 1);
                    }
                }
                const obj = {
                    "quantity": quantity,
                    "weekNumber": clone[i].weekNumber
                }
                array.push(obj)
            }
        }
        console.log('array of orders:' + JSON.stringify(array))
        this.setState({
            lastWeeksMadeProducts: array
        })
    }

    getLastMonthMadeProducts = () => {
        const clone = JSON.parse(JSON.stringify(this.props.orderDetailsReducer.last_month_orders))
        console.log('Month ORDERS: ' + JSON.stringify(clone))
        const array = []
        for (var i = 0; i < 5; i++) {
            if (clone[i] !== null && clone[i] !== undefined) {
                let quantity = clone[i].quantity;
                for (var a = i + 1; a < clone.length; a++) {
                    if (moment(clone[i].orderFinishDate).format('YYYY/MM/DD') === moment(clone[a].orderFinishDate).format('YYYY/MM/DD')) {
                        quantity = quantity + clone[a].quantity;
                        var values = clone.findIndex(x => x.id === clone[a].id)
                        clone.splice(values, 1);
                    }
                }
                const obj = {
                    "quantity": quantity,
                    "orderFinishDate": moment(clone[i].orderFinishDate).format('YYYY/MM/DD')
                }
                array.push(obj)
            }
        }
        console.log('array of MONTH orders:' + JSON.stringify(array))
        this.setState({
            lastMonthMadeProducts: array
        })
    }

    // getUser = (userId) => {
    //     const user = this.props.usersListReducer.users.find(u => String(u.id) === userId)
    //     if (user !== null && user !== undefined) {
    //         return (<p>${user.name} ${user.surname}</p>)
    //     } else {
    //         return <p></p>
    //     }

    // }

    componentDidMount() {
        if (this.props.usersReducer.currentUser !== null) {
            this.props.getUsers(() => {
                console.log(JSON.stringify(this.props.usersListReducer.users))
            })
            //WeeklyWorkSchedule works. Only for this particular week. Savaites ukio darbai
            this.props.getWeekWorks()
            //Gaminiu tvarkarascio darbai.
            this.props.getUrgetOrders()
            //Klientu darbu lentele. Not-standart works.
            this.props.getClientsOrders();


            //Express neatlikti uzsakymai
            this.props.getUncompletedExpressOrders();
            // get uncompleted orders. Daugiausia nepagamintu produktu
            this.props.getOrdersUncompleted();
            // get uncompleted orders for warehouse. Gaminimo i sandeli lentele
            this.props.getUncompletedWarehouseOrders();
            // get from warehouse. Gaminiu kiekis sandelyje
            this.props.getWarehouseProducts();
            //Get most recents orders/works. Newest 10 works. Naujausi atlikti darbai
            this.props.getRecentOrders();


            // Pagamintu gaminiu ataskaita per 30 dienu. Uz kiekviena diena
            this.props.getLastMonthCompletedOrders(() => {
                this.getLastMonthMadeProducts();
            })
            // Pagamintu gaminiu kiekis savaitemis
            this.props.getLastWeeksCompletedOrders(() => {
                this.getLastWeeksMadeProducts()
            })
        } else {
            this.props.history.push('/login');
        }

    }
    datediff(first) {
        var future = moment(first);
        var today = new Date();
        var start = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        return future.diff(start, 'days');
    }

    getTime(type) {
        const array = this.state.products //.map((x) => x.collectionTime)
        const orderarray = this.state.orders
        const orderCode = orderarray.map((x) => x.productCode)
        const orderStatus = orderarray.map((x) => x.status)
        const productCode = array.map((x) => x.code)
        // console.log(orderCode)
        // console.log(productCode)

        orderCode.forEach(element => {
            productCode.forEach(element1 => {
                orderStatus.forEach(element2 => {
                    // console.log(element)
                    // console.log(element1)
                    if (element === element1 && element2 === false) {
                        // console.log('true')
                        var sum = array.map((x) => x.collectionTime).reduce((a, b) => {
                            return a + b;
                        });
                        var sum1 = array.map((x) => x.bondingTime).reduce((a, b) => {
                            return a + b;
                        });
                        var sum2 = array.map((x) => x.laserTime).reduce((a, b) => {
                            return a + b;
                        });
                        var sum3 = array.map((x) => x.paintingTime).reduce((a, b) => {
                            return a + b;
                        });
                        var sum4 = array.map((x) => x.milingTime).reduce((a, b) => {
                            return a + b;
                        });
                        var sum5 = array.map((x) => x.packingTime).reduce((a, b) => {
                            return a + b;
                        });
                        this.setState({
                            collectionTime: sum,
                            bondingTime: sum1,
                            laserTime: sum2,
                            paintingTime: sum3,
                            milingTime: sum4,
                            packingTime: sum5
                        })
                    }
                })
            })
        });


    }
    onChange(value, record) {
        const postObj = {
            "userId": record.userId,
            "description": record.description,
            "done": value,
        }
        const reducerObj = {
            "id": record.id,
            "userId": record.userId,
            "user": record.user,
            "description": record.description,
            "done": value,
            "date": record.date
        }
        this.props.updateWork(postObj, reducerObj);
        console.log(postObj)
        console.log(reducerObj)
        // console.log(e.target.value)

        // this.setState({
        //     done: !this.state.done
        // })
    }
    render() {
        const columns = [
            {
                title: 'Vardas',
                dataIndex: 'user',
                width: '25%',
                render: (text, record, index) => (
                    <Typography.Text>{text.name}</Typography.Text>
                )
            },
            {
                title: 'Darbas',
                dataIndex: 'description',
                width: '25%'
            },
            {
                title: 'Atlikta',
                dataIndex: 'done',
                width: '25%',
                render: (text, record, index) => (
                    // <Typography.Text>{text === false ? <Tag className='Neatlikta'>Neatlikta</Tag> : <Tag className='atlikta'>Atlikta</Tag>}</Typography.Text>
                    <Checkbox onChange={(e) => this.onChange(e.target.checked, record)} value={text} defaultChecked={text} />
                )
            },
            {
                title: 'Data',
                dataIndex: 'date',
                width: '25%',
                render: (text, record, index) => (
                    <Typography.Text>{moment(text).format('YYYY/MM/DD')}</Typography.Text>
                )
            }
        ]
        const workColumns = [
            {
                title: 'surinkimo laikas',
                width: '10%',
                render: (text, record, index) => (
                    <Typography.Text>{this.state.collectionTime} min</Typography.Text>
                )
            },
            {
                title: 'Suklijavimo laikas',
                width: '10%',
                render: (text, record, index) => (
                    <Typography.Text>{this.state.bondingTime} min</Typography.Text>
                )
            },
            {
                title: 'Lazeriavimo laikas',
                width: '10%',
                render: (text, record, index) => (
                    <Typography.Text>{this.state.laserTime} min</Typography.Text>
                )
            },
            {
                title: 'Dažymo laikas',
                width: '10%',
                render: (text, record, index) => (
                    <Typography.Text>{this.state.paintingTime} min</Typography.Text>
                )
            },
            {
                title: 'Frezavimo laikas',
                width: '10%',
                render: (text, record, index) => (
                    <Typography.Text>{this.state.milingTime} min</Typography.Text>
                )
            },
            {
                title: 'Pakavimo laikas',
                width: '10%',
                render: (text, record, index) => (
                    <Typography.Text>{this.state.packingTime} min</Typography.Text>
                )
            },

        ]
        const urgentOrders = [
            {
                title: 'Deadline',
                dataIndex: 'orderFinishDate',
                width: '10%',
                render: (text, record, index) => (
                    <p>{moment(text).format('YYYY/MM/DD')}</p>
                )
            },
            {
                title: 'NR',
                dataIndex: 'orderNumber',
                width: '10%'
            },
            {
                title: 'Kodas',
                dataIndex: 'productCode',
                width: '10%'
            },
            // {
            //     title: 'Foto',
            //     dataIndex: 'product',
            //     width: '10%',
            //     render: (text, record, index) => (
            //         <div>
            //             {text.imagePath === null || text.imagePath === undefined ?
            //                 <p></p> : <Image src={text.imagePath} />}
            //         </div>
            //     )
            // },
            {
                title: 'Kiekis',
                dataIndex: 'quantity',
                width: '10%'
            },
            {
                title: 'Užsakymo tipas',
                dataIndex: 'orderType',
                width: '10%'
            },
            {
                title: 'Platforma',
                dataIndex: 'platforma',
                width: '10%'
            },
            // {
            //     title: 'Surinkta',
            //     dataIndex: 'CollectionUserId',
            //     width: '10%',
            //     render: (text, record, index) => {
            //         this.getUser
            //     }
            // },
            {
                title: 'Vėluojama dienų',
                width: '10%',
                render: (text, record, index) => (
                    // <Tag className='Neatlikta'>{record.status ? 'Atlikta' : this.datediff(record.orderFinishDate)}</Tag>
                    <Typography.Text>{record.status ? <Tag className='atlikta'>Atlikta</Tag> : this.datediff(record.orderFinishDate) < 0 ? <Tag className='Neatlikta'>{Math.abs(this.datediff(record.orderFinishDate))}</Tag> : <Tag className='atlikta'>{Math.abs(this.datediff(record.orderFinishDate))}</Tag>} </Typography.Text>

                )
            }
        ]



        const recentWorksColumns = [
            {
                title: "Laikas",
                dataIndex: "time",
                width: '15%',
                render: (text, record, index) => (
                    <Typography.Text>{moment(text).format("HH:mm")}  {moment(text).format("YYYY/MM/DD")}</Typography.Text>
                )
            },
            {
                title: 'Nr',
                dataIndex: 'orderNumber',
                width: '15%',
                render: (text, record, index) => (
                    <Typography.Text>{text.orderNumber}</Typography.Text>
                )
            },
            {
                title: 'Kodas',
                dataIndex: 'productCode',
                width: '15%',
                render: (text, record, index) => (
                    <Typography.Text>{text}</Typography.Text>
                )
            },
            {
                title: 'Foto',
                dataIndex: 'product',
                width: '15%',
                render: (text, record, index) => {
                    if (text === null || text === undefined){
                        if (record.imagePath === undefined || record.imagePath === null){
                            return (<p></p>)
                        }else{
                            return (<Image src={record.imagePath} alt='Foto' />)
                        }
                    }else {
                        if (text.imagePath === null)
                            return (<p></p>)
                        else
                            return (<Image src={text.imagePath} alt='Foto' />)
                    }
                }
            },
            {
                title: 'Kiekis',
                dataIndex: 'quantity',
                width: '15%'
            },
            {
                title: "Vardas",
                width: '15%',
                render: (text, record, index) => (
                    <Typography.Text>{record.user.name}  {record.packingComplete !== null ? <p>Supakavo</p> : <p></p>}</Typography.Text>
                )
            },
        ]
        const uncompletedExpressOrderColumns = [
            {
                title: 'Deadline',
                dataIndex: 'orderFinishDate',
                width: '10%',
                render: (text, record, index) => (
                    <p>{moment(text).format('YYYY/MM/DD')}</p>
                )
            },
            {
                title: 'Nr',
                dataIndex: 'orderNumber',
                width: '10%'
            },
            {
                title: 'Kiekis',
                dataIndex: 'quantity',
                width: '10%'
            },
            {
                title: 'Kodas',
                dataIndex: 'productCode',
                width: '10%'
            },
            // {
            //     title: 'Foto',
            //     dataIndex: 'product',
            //     width: '10%',
            //     render: (text, record, index) => (
            //         <div>
            //             {text.imagePath === null || text.imagePath === undefined ?
            //                 <p></p> : <Image src={text.imagePath} />}
            //         </div>
            //     )
            // },
            {
                title: 'Platforma',
                dataIndex: 'platforma',
                width: '10%'
            }
        ]


        const completedWarehouseOrders = [
            {
                title: 'Kodas',
                dataIndex: 'productCode',
                width: '30%'
            },
            {
                title: 'Kiekis',
                dataIndex: 'quantityProductWarehouse',
                width: '30%'
            },
            {
                title: 'Nuotrauka',
                dataIndex: 'imagePath',
                width: '30%',
                render: (text, record, index) => (
                    <div>
                        {text === null || text === undefined ?
                            <p></p> : <Image src={text} />}
                    </div>
                )
            },
        ]

        //daugiausia nepagamintu produktu
        const uncompletedOrders = [
            {
                title: 'Kodas',
                dataIndex: 'productCode',
                width: '20%'
            },
            {
                title: 'Kiekis',
                dataIndex: 'quantity',
                width: '20%'
            },
            {
                title: 'Nuotrauka',
                dataIndex: 'imagePath',
                width: '20%',
                render: (text, record, index) => (
                    <div>
                        {text === null || text === undefined ?
                            <p></p> : <Image src={text} height={70} />}
                    </div>
                )
            },
            {
                title: 'Deadline(didžiausia)',
                dataIndex: 'orderFinishDate',
                width: '20%',
                render: (text, record, index) => (
                    <Typography.Text>{moment(text).format("YYYY/MM/DD")}</Typography.Text>
                )
            },
            {
                title: 'Deadline(mažiausia)',
                dataIndex: 'minOrderFinishDate',
                width: '20%',
                render: (text, record, index) => (
                    <Typography.Text>{moment(text).format("YYYY/MM/DD")}</Typography.Text>
                )
            }
        ]


        const uncompletedWarehouseOrders = [
            {
                title: 'Kodas',
                dataIndex: 'productCode',
                width: '20%'
            },
            {
                title: 'Kiekis',
                dataIndex: 'quantity',
                width: '20%'
            },
            {
                title: 'Foto',
                dataIndex: 'imagePath',
                width: '20%',
                render: (text, record, index) => (
                    <div>
                        {text === null || text === undefined ?
                            <p></p> : <Image src={text} height={70} />}
                    </div>
                )
            },
            {
                title: 'Deadline(didžiausia)',
                dataIndex: 'orderFinishDate',
                width: '20%',
                render: (text, record, index) => (
                    <Typography.Text>{moment(text).format("YYYY/MM/DD")}</Typography.Text>
                )
            },
            {
                title: 'Deadline(mažiausia)',
                dataIndex: 'minOrderFinishDate',
                width: '20%',
                render: (text, record, index) => (
                    <Typography.Text>{moment(text).format("YYYY/MM/DD")}</Typography.Text>
                )
            }
        ]

        const clientOrders = [
            {
                title: 'Data',
                dataIndex: 'date',
                width: '25%'
            },
            {
                title: 'NR',
                dataIndex: 'orderNumber',
                width: '25%'
            },
            {
                title: 'Klientas',
                dataIndex: 'customer',
                width: '25%',
                render: (text, record, index) => (
                    <Typography.Text>{text.name}  {text.companyName}</Typography.Text>
                )
            },
            {
                title: 'Būklė',
                dataIndex: 'status',
                width: '25%',
                render: (text, record, index) => (
                    <Typography.Text>{text === false ? <Tag className='Neatlikta'>Neatlikta</Tag> : <Tag className='atlikta'>Atlikta</Tag>}</Typography.Text>
                )
            },
        ]
        return (
            <>
                <h1>Pagrindinis</h1>
                <div style={{ marginTop: 45, marginBottom: 45 }}>

                    <Row>

                        <Col lg={12} md={24} >
                            {/* <Row gutter={16}>
                                <Col span={16}> */}
                            <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                <h5>Suplanuotas darbo laikas</h5>
                            </div>
                            {/* </Col>
                            </Row> */}
                            {/* <Row gutter={16}> */}
                            {/* <Col span={24}> */}
                            <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                <Table
                                    rowKey="id"
                                    columns={workColumns}
                                    dataSource={this.state.Works}
                                    pagination={{ pageSize: 15 }}
                                    bWorked
                                    scroll={{ x: 'calc(200px + 50%)' }}

                                />

                            </Card>
                            {/* </Col> */}
                            {/* </Row> */}
                        </Col>
                        <div style={{ padding: '10px' }}></div>
                        <Col lg={10} md={24} >
                            {/* <Row gutter={16}>
                                <Col span={16}> */}
                            <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                <h5>Savaitės ūkio darbai</h5>
                            </div>
                            {/* </Col>
                            </Row> */}
                            {/* <Row gutter={16}> */}
                            {/* <Col span={24}> */}
                            <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                <Table
                                    rowKey="id"
                                    columns={columns}
                                    dataSource={this.props.weeklyWorkScheduleReducer.workSchedules}
                                    pagination={{ pageSize: 15 }}
                                    bWorked
                                    scroll={{ x: 'calc(200px + 50%)' }}

                                />

                            </Card>
                            {/* </Col> */}
                            {/* </Row> */}
                        </Col>

                    </Row>


                    <Col span={24} style={{ marginTop: '20px' }}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                    <h5>Gaminių tvarkaraškis(Užsakymai)</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                    <Table
                                        rowKey="id"
                                        columns={urgentOrders}
                                        dataSource={this.props.orderDetailsReducer.urgent_orders}
                                        pagination={{ pageSize: 10 }}
                                        bordered
                                        scroll={{ x: 'calc(200px + 50%)' }}
                                    />

                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    {/* Klientu darbu lentele */}
                    <Col span={24} style={{ marginTop: '20px' }}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                    <h5>Klientų darbų lentelė</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                    <Table
                                        rowKey="id"
                                        columns={clientOrders}
                                        dataSource={this.props.orderDetailsReducer.clients_orders}
                                        pagination={{ pageSize: 10 }}
                                        bordered
                                        scroll={{ x: 'calc(200px + 50%)' }}
                                    />

                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24} style={{ marginTop: '20px' }}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                    <h5>Express neatlikti užsakymai</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                    <Table
                                        rowKey="id"
                                        columns={uncompletedExpressOrderColumns}
                                        dataSource={this.props.orderDetailsReducer.uncompleted_express_orders}
                                        pagination={{ pageSize: 10 }}
                                        bordered
                                        scroll={{ x: 'calc(200px + 50%)' }}
                                    />

                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    {/* <Col span={24} style={{ marginTop: '60px', bottom: '50px' }}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                    <h5>Naujausi produktai</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                    <Table
                                        rowKey="id"
                                        columns={productColumns}
                                        dataSource={this.state.products.slice(-3)}
                                        pagination={{ pageSize: 15 }}
                                        bordered
                                        scroll={{ x: 'calc(300px + 50%)' }}
                                    />

                                </Card>
                            </Col>
                        </Row>
                    </Col> */}

                    {/* daugiausia nepagamintu produkt */}
                    <Col span={24} style={{ marginTop: '60px', bottom: '50px' }}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                    <h5>Daugiausia nepagamintų produktų</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                    <Table
                                        rowKey="id"
                                        columns={uncompletedOrders}
                                        dataSource={this.props.orderDetailsReducer.uncompleted_orders}
                                        pagination={false}
                                        bordered
                                        scroll={{ x: 'calc(300px + 50%)' }}
                                    />

                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24} style={{ marginTop: '60px', bottom: '50px' }}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                    <h5>Gaminimo į sandėlį lentelė</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                    <Table
                                        rowKey="id"
                                        columns={uncompletedWarehouseOrders}
                                        dataSource={this.props.orderDetailsReducer.uncompleted_warehouse_orders}
                                        pagination={false}
                                        bordered
                                        scroll={{ x: 'calc(300px + 50%)' }}
                                    />

                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24} style={{ marginTop: '60px', bottom: '50px' }}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                    <h5>Gaminių kiekis sandėlyje</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                    <Table
                                        rowKey="id"
                                        columns={completedWarehouseOrders}
                                        dataSource={this.props.warehouseReducer.warehouse_products}
                                        pagination={false}
                                        bordered
                                        scroll={{ x: 'calc(300px + 50%)' }}
                                    />

                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24} style={{ marginTop: '60px', bottom: '50px' }}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                    <h5>Naujausi atlikti darbai</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                    <Table
                                        rowKey="id"
                                        columns={recentWorksColumns}
                                        dataSource={this.props.orderDetailsReducer.recent_orders}
                                        pagination={false}
                                        bordered
                                        scroll={{ x: 'calc(300px + 50%)' }}
                                    />

                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24} style={{ marginTop: '60px', bottom: '50px' }}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                    <h5>Paskutinių gaminių ataskaita per paskutines 30 dienų</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                    <LastMonthProducts data={this.state.lastMonthMadeProducts} />
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24} style={{ marginTop: '60px', bottom: '50px' }}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                    <h5>Pagamintų gaminių kiekis</h5>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                    <LastWeeksProducts data={this.state.lastWeeksMadeProducts} />
                                </Card>
                            </Col>
                        </Row>
                    </Col>


                </div>


            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        usersReducer: state.usersReducer,
        weeklyWorkScheduleReducer: state.weeklyWorkScheduleReducer,
        usersListReducer: state.usersListReducer,
        orderReducer: state.orderReducer,
        productsReducer: state.productsReducer,
        materialsWarehouseReducer: state.materialsWarehouseReducer.materialsWarehouseData,
        orderDetailsReducer: state.orderDetailsReducer,
        warehouseReducer: state.warehouseReducer
    }
}
export default connect(mapStateToProps, { getWeekWorks, getUsers, updateWork, getOrders, getUncompletedWarehouseOrders, getUncompletedExpressOrders, getOrdersUncompleted, getWarehouseProducts, getMaterialsWarehouseData, getLastWeeksCompletedOrders, getClientsOrders, getProducts, getLastMonthCompletedOrders, getUrgetOrders, getRecentOrders })(withRouter(HomeScreen))

