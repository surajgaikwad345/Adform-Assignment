import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Select, Button } from 'antd';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { addCampaigns } from '../redux/thunks/usersCampaignSlice';

const { RangePicker } = DatePicker;

const AddCampaignModal = ({ users = [] }) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const showModal = () => setVisible(true);
    const closeModal = () => {
        form.resetFields();
        setVisible(false);
    };

    const onFinish = (values) => {
        const [startDate, endDate] = values.dateRange;

        const newCampaign = {
            id: Date.now(),
            name: values.name,
            startDate: dayjs(startDate).format('M/D/YYYY'),
            endDate: dayjs(endDate).format('M/D/YYYY'),
            Budget: values.budget,
            userName: values.userName,
        };

        dispatch(addCampaigns([newCampaign]));
        closeModal();
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Add New Campaign
            </Button>

            <Modal
                title="Add New Campaign"
                className='AddCampaignModal'
                open={visible}
                onCancel={closeModal}
                onOk={() => form.submit()}
                okText="Add"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="name"
                        label="Campaign Name"
                        rules={[{ required: true, message: 'Please enter a campaign name' }]}
                    >
                        <Input style={{ height: '40px' }} />
                    </Form.Item>

                    <Form.Item
                        name="userName"
                        label="User Name"
                        rules={[{ required: true, message: 'Please enter a user name' }]}
                    >
                        <Input style={{ height: '40px' }} />
                    </Form.Item>

                    <Form.Item
                        name="dateRange"
                        label="Date Range"
                        rules={[
                            { required: true, message: 'Please select a start and end date' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || value.length !== 2) {
                                        return Promise.reject();
                                    }
                                    const [start, end] = value;
                                    if (dayjs(start).isAfter(dayjs(end))) {
                                        return Promise.reject('Start date must be before end date');
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <RangePicker format="DD/MM/YYYY" style={{ height: '40px', width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="budget"
                        label="Budget (USD)"
                        rules={[{ required: true, message: 'Please enter a budget' }]}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%', height: '40px' }}
                            onKeyDown={(e) => {
                                const allowedKeys = [
                                    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Home', 'End', '-', '.'
                                ];
                                if (
                                    !/[0-9]/.test(e.key) &&
                                    !allowedKeys.includes(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddCampaignModal;
