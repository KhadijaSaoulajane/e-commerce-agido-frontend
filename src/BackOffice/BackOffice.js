import React, {useState, useEffect, Fragment} from 'react';
import ApiService from '../services/ApiService';
import TransactionsTable from '../components/TransactionsTable';
import {Table, Pagination, ListGroup, Form, Card} from 'react-bootstrap';
function BackOffice() {
  const [customers, setCustomers] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [sums, setSums] = useState({ deposits: 0, withdrawals: 0 });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5);
    const [activeKey, setActiveKey] = useState('accounts');

    const calculateAndSetSums = (customers, startDate, endDate) => {
    let deposits = 0;
    let withdrawals = 0;

    customers.forEach((customer) => {
      customer.transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.created_at);

        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date();
      console.log("transactionDate >= start && transactionDate <= end: ",transactionDate >= start && transactionDate <= end)
        if (
            (!start && !endDate) ||
            (transactionDate >= start && transactionDate <= end)
        ) {
          if (transaction.type === 'D') {
            deposits += transaction.amount;
          } else if (transaction.type === 'W') {
            withdrawals += transaction.amount;
          }
        }
      });
    });

    setSums({ deposits, withdrawals });
  };

  useEffect(() => {
    calculateAndSetSums(customers, startDate, endDate);
  }, [customers, startDate, endDate]);

  useEffect(() => {
      getAllCustomerAccounts();
  }, []);

    const getAllCustomerAccounts = () => {
        ApiService.getAllCustomerAccounts()
            .then((response) => {
                setCustomers(response.data);
            })
            .catch((error) => console.log(error));
    };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(customers.length / customersPerPage); i++) {
    pageNumbers.push(i);
  }
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const renderContent = () => {
        switch (activeKey) {
            case 'accounts':
                return (
                    <Fragment>
                        <h1 className="text-center mb-5">Accounts Overview</h1>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Account ID</th>
                                <th>Balance</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentCustomers.map(customer => (
                                <tr key={customer.account_id}>
                                    <td>{customer.account_id}</td>
                                    <td>{customer.balance}</td>
                                    <td>
                                        <button
                                            style={{ background: 'transparent', border: '0' }}
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setIsModalVisible(true);
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-eye"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <Pagination className="d-flex justify-content-center">
                            {pageNumbers.map(number => (
                                <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                                    {number}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </Fragment>
                );
            case 'pendingTransactions':
                return (
                    <Fragment>
                        <h1 className="text-center mb-5">Pending Transactions</h1>
                        <TransactionsTable
                            transactions={customers.map(customer => customer.transactions).flat()
                                .filter(transaction => transaction.type === 'W' && transaction.approved === false)
                            }
                            onTransactionApproved={getAllCustomerAccounts}
                            isAgent={true}

                        />
                    </Fragment>
                );
            case 'deposits':
                return (
                    <Fragment>
                        <h1 className="text-center mb-5">Deposits overview</h1>
                        <div className="row mb-3">
                            <Form.Group className="mb-3 col-6 d-flex flex-column align-items-center">
                                <Form.Label >Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    id="start-date"
                                    name="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Form.Group>
                        <Form.Group className="mb-3 col-6 d-flex flex-column align-items-center">
                            <Form.Label >End Date</Form.Label>
                            <Form.Control
                                type="date"
                                id="end-date"
                                name="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </Form.Group>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <Card>
                                    <Card.Body className="p-0">
                                       <h5 className="text-center">Deposits</h5>
                                        <h2 className="text-center"><span>{sums.deposits} €</span></h2>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="col-6">
                                <Card style={{backgroundColor: 'lightsalmon'}}>
                                    <Card.Body className="p-0">
                                        <h5 className="text-center">Withdrawals</h5>
                                        <h2 className="text-center"><span>{sums.withdrawals} €</span></h2>
                                    </Card.Body>

                                </Card>
                            </div>


                        </div>

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
                    <ListGroup.Item action onClick={() => setActiveKey('accounts')} active={activeKey === 'accounts'}>
                        Accounts
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => setActiveKey('pendingTransactions')} active={activeKey === 'pendingTransactions'}>
                        Pending Transactions
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => setActiveKey('deposits')} active={activeKey === 'deposits'}>
                        Deposits
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
                  <h3 className="mb-0">Transactions list</h3>
                <button
                    className="border-0 ms-auto"
                    type="button" onClick={() => setIsModalVisible(false)}
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
                <TransactionsTable
                  transactions={selectedCustomer.transactions}
                  onTransactionApproved={getAllCustomerAccounts}
                  isAgent={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}


    </Fragment>
  );
}

export default BackOffice;
