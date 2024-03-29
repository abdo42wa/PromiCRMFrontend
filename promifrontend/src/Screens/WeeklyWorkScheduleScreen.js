import React from 'react';
import '../App.css'
import { connect } from 'react-redux';
import { getWorks, addWork, updateWork } from '../appStore/actions/weeklyworkschedulesAction'
import { getUsers } from '../appStore/actions/userListActions'
import { Table, Space, Card, Typography, Col, Row, Button, Tag } from 'antd'
import { tableCardStyle, tableCardBodyStyle, buttonStyle } from '../styles/customStyles.js';
import { withRouter } from 'react-router-dom';
import AddWeeklyWorkScheduleComponent from '../components/weekly_work_schedule_components/AddWeeklyWorkScheduleComponent'
import UpdateWeeklyWorkScheduleComponent from '../components/weekly_work_schedule_components/UpdateWeeklyWorkScheduleComponent'
import moment from 'moment';




class WeeklyWorkScheduleScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addWorkVisibility: false,
            updateWork: {
                visibility: false,
                record: null
            }

        }
    }

    showAddWorkModal = () => {
        this.setState({
            addWorkVisibility: true
        })
    }
    unshowAddWorkModal = () => {
        this.setState({
            addWorkVisibility: false
        })
    }
    saveAddWork = (postObj) => {
        this.props.addWork(postObj)
        this.unshowAddWorkModal();
        // window.location.reload();
    }

    showWorkModal = (record) => {
        this.setState(prevState => ({
            updateWork: {// object that we want to update
                ...prevState.updateWork,// keep all other key-value pairs
                visibility: true,// update the value of specific key
                record: record
            }
        }));
    }
    unshowWorkModal = () => {
        this.setState(prevState => ({
            updateWork: {
                ...prevState.updateWork,
                visibility: false,
                record: null
            }
        }));
    }
    saveWork = (postObj, reducerObj) => {
        this.props.updateWork(postObj, reducerObj)
        this.unshowWorkModal();
    }
    componentDidMount() {
        if (this.props.usersReducer.currentUser !== null) {
            this.props.getWorks()
        } else {
            this.props.history.push('/login');
        }

    }
    render() {
        const columns = [
            {
                title: 'Atnaujinti',
                width: '5%',
                render: (text, record, index) => (
                    <Button onClick={(e) => this.showWorkModal(record)}>Atnaujinti</Button>
                )
            },
            {
                title: 'Vartotojo vardas',
                dataIndex: 'user',
                width: '5%',
                render: (text, record, index) => (
                    <Typography.Text>{text.name}</Typography.Text>
                )
            },
            {
                title: 'Darbas',
                dataIndex: 'description',
                width: '10%'
            },
            {
                title: 'Data',
                dataIndex: 'date',
                width: '5%',
                render: (text, record, index) => (
                    <Typography.Text>{moment(text).format('YYYY/MM/DD')}</Typography.Text>
                )
            },
            {
                title: 'Atlikta',
                dataIndex: 'done',
                width: '5%',
                render: (text, record, index) => (
                    <Typography.Text>{text === false ? <Tag className='Neatlikta'>Neatlikta</Tag> : <Tag className='atlikta'>Atlikta</Tag>}</Typography.Text>
                )
            },
        ]
        return (
            <>

                <div style={{ marginTop: 45, marginBottom: 45 }}>
                    <Col span={24} offset={2}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <div style={{ marginRight: '40px', textAlign: 'start' }}>
                                    <Typography.Title>Savaitės ūkio darbai</Typography.Title>
                                    <Typography.Text>Pridėkite ir atnaujinkite darbus.</Typography.Text>

                                </div>
                            </Col>
                        </Row>
                        <div style={{ padding: '15px' }}></div>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Card size={'small'} style={{ ...tableCardStyle }} bodyStyle={{ ...tableCardBodyStyle }}>
                                    <Table
                                        rowKey="id"
                                        columns={columns}
                                        dataSource={this.props.weeklyWorkScheduleReducer.workSchedules}
                                        pagination={{ pageSize: 15 }}
                                        // bWorked
                                        scroll={{ x: 'calc(700px + 50%)' }}
                                        footer={() => (<Space style={{ display: 'flex', justifyContent: 'space-between' }}><Button size="large" style={{ ...buttonStyle }} onClick={this.showAddWorkModal}>Pridėti grafiką</Button></Space>)}
                                    />

                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </div>
                {this.state.addWorkVisibility !== false ?
                    <AddWeeklyWorkScheduleComponent visible={this.state.addWorkVisibility} save={this.saveAddWork}
                        onClose={this.unshowAddWorkModal} />
                    : null}
                {this.state.updateWork.visibility !== false ?
                    <UpdateWeeklyWorkScheduleComponent visible={this.state.updateWork.visibility} record={this.state.updateWork.record}
                        save={this.saveWork} onClose={this.unshowWorkModal} /> :
                    null}

            </>
        )
    }
}

// get states from redux. map them to props
const mapStateToProps = (state) => {
    return {
        usersReducer: state.usersReducer,
        weeklyWorkScheduleReducer: state.weeklyWorkScheduleReducer,
        usersListReducer: state.usersListReducer
    }
}

// connect to redux states. define all actions
export default connect(mapStateToProps, { getWorks, addWork, updateWork, getUsers })(withRouter(WeeklyWorkScheduleScreen))


