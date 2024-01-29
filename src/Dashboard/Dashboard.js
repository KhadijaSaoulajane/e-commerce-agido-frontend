import React, { useState, useEffect,Fragment } from 'react';
import ApiService from '../services/ApiService';
import TransactionsTable from "../components/TransactionsTable";
import {Button, Card, Form, ListGroup} from "react-bootstrap";

function Dashboard({user}) {
  const [customerAccount, setCustomerAccount] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [transaction, setTransaction] = useState({ amount: 0.0, type: '',account:null });
    const [error, setError] = useState(null);
    const [activeKey, setActiveKey] = useState('overview');

  useEffect(() => {
    ApiService.getCustomerAccount(user.user_id)
      .then((response) => {
        setCustomerAccount(response.data);
      })
      .catch(() => setError("Something went wrong, please try again!"));
  }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setTransaction((prevState) => ({ ...prevState, [name]: value }));
    };
    const createTransaction = (transaction)=>{
        setError(null);
        ApiService.createTransaction(transaction).then((response) => {
            setCustomerAccount({ ...customerAccount, balance:response.data.balance, transactions: response.data.transactions })
            setTransaction({ amount: 0.0, type: '',account:null })
            setIsModalVisible(false);
        })
            .catch(() => {
                setError("Something went wrong, please try again!");
            });
    }

    const getUnapprovedTransactions = () => {
        const transactions = customerAccount.transactions?.filter(transaction=> !transaction.approved && transaction.type ==='W').length;
        return (transactions);
    }
    const renderContent = () => {
        switch (activeKey) {
            case 'overview':
                return (
                    <Fragment>
                        <h1 className="mb-5">Overview</h1>
                        <div className="row d-flex justify-content-center flex-wrap" style={{gridRowGap: '2rem'}}>
                            <div className="col-6">
                                <Card >
                                    <Card.Body className="p-0">
                                        <h5 className="text-center">Balance</h5>
                                        <h2 className="text-center"><span>{customerAccount.balance} €</span></h2>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="col-6">
                                <Card style={{backgroundColor: '#26b771'}}>
                                    <Card.Body className="p-0">
                                        <h5 className="text-center">No Transactions</h5>
                                        <h2 className="text-center"><span>{customerAccount.transactions?.length} </span></h2>
                                    </Card.Body>

                                </Card>
                            </div>
                            <div className="col-6">
                                <Card style={{backgroundColor: 'lightcoral'}}>
                                    <Card.Body className="p-0">
                                        <h5 className="text-center">Unapproved Withdrawals</h5>
                                        <h2 className="text-center"><span>{getUnapprovedTransactions()} </span></h2>
                                    </Card.Body>

                                </Card>
                            </div>

                        </div>

                    </Fragment>
                );
            case 'transactions':
                return (
                    <Fragment>
                        <h1 className="mb-5">Transactions</h1>
                        <div className="d-flex justify-content-end mb-3">
                            <Button  type="submit" style={{backgroundColor:'#26b771',border:0}} onClick={() => {
                                setIsModalVisible(true);
                            }}>
                                + Make a new transaction
                            </Button>
                        </div>

                        <TransactionsTable
                            transactions={customerAccount.transactions}
                            isAgent={false}
                        />
                    </Fragment>
                );

            default:
                return <Fragment />;
        }
    };

    return (
    <Fragment>
        <div className="d-flex h-100">
            <div className="sidebar" style={{ width: '250px' }}>
                <ListGroup className="sidebar-list">
                    <ListGroup.Item action onClick={() => setActiveKey('overview')} active={activeKey === 'overview'}>
                        Account overview
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => setActiveKey('transactions')} active={activeKey === 'transactions'}>
                        Transactions
                    </ListGroup.Item>
                </ListGroup>
            </div>
            <div className="content flex-grow-1 p-3">
                {renderContent()}
            </div>
        </div>


        {isModalVisible && (
            <div
                className="modal"
                style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                className="border-0 ms-auto"
                                type="button" onClick={() => {setIsModalVisible(false);
                                    setTransaction({ amount: 0.0, type: '',account:null })
                            }}
                                style={{ background: 'transparent' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path
                                        d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3 d-flex justify-content-center align-items-center" style={{columnGap: '10px'}}>
                                <span>Amount</span>
                            <Form.Group>
                                <Form.Control
                                    type="number"
                                    placeholder="Transaction amount"
                                    name="amount"
                                    value={transaction.amount}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button disabled={transaction.amount === 0.0} type="button" style={{backgroundColor:'#26b771',border:0}}
                                    onClick={() => {createTransaction({ ...transaction, type: 'D',account:customerAccount });
                                    }}>
                                Deposit
                            </Button>
                            <Button disabled={transaction.amount === 0.0} type="button" style={{backgroundColor:'lightcoral',border:0}}
                                    onClick={() => {createTransaction({ ...transaction, type: 'W',account:customerAccount });
                                    }}>
                                Withdraw
                            </Button>
                            </div>

                            {
                                error && <span className="text-red-500 p-2">{error}</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )}
    </Fragment>
  );
}

export default Dashboard;
