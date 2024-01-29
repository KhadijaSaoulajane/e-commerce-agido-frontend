import React, {Fragment,useState} from 'react';
import ApiService from "../services/ApiService";
import {Table, Pagination} from 'react-bootstrap';

function TransactionsTable({ transactions,onTransactionApproved,isAgent }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionsPerPage] = useState(5);

  const approveTransaction = (transaction_id)=>{
        ApiService.approveTransaction(transaction_id).then((response) => {
            if (response && onTransactionApproved) {
                onTransactionApproved();
            }
        })
            .catch((error) => console.log(error));
    }

    const pageNumbers = [];
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    let currentTransactions = [];
    if(transactions){
      for (let i = 1; i <= Math.ceil(transactions?.length / transactionsPerPage); i++) {
          pageNumbers.push(i);
      }
      const indexOfLastTransaction = currentPage * transactionsPerPage;
      const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
      currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  }

    return (
      <Fragment>
          {transactions?.length > 0 &&
              <Fragment>
                  <Table className="text-center" striped bordered hover style={{verticalAlign:'middle',borderColor: 'transparent'}}>
                      <thead>
                      <tr>
                          <th>ID</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {currentTransactions.map((transaction) => (
                          <tr key={transaction.transaction_id}>
                              <td>{transaction.transaction_id}</td>
                              <td>{transaction.created_at}</td>
                              <td>{transaction.amount} €</td>
                              <td>{transaction.type}</td>
                              <td>{transaction.type === 'W'?  transaction.approved ? "Approved":"Not-Approved" : "-"}</td>
                              <td> { transaction.type === 'W' && !transaction.approved && isAgent &&

                                  <button
                                      style={{ background: 'transparent', border: '0' }}
                                      onClick={() => {
                                          approveTransaction(transaction.transaction_id)
                                      }}
                                  >
                                      <svg color="green" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                           className="bi bi-check-circle" viewBox="0 0 16 16">
                                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                          <path
                                              d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                                      </svg>
                                  </button>

                              } </td>
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

          }
          {!transactions || transactions.length === 0 &&
          <p>No transactions</p>}
      </Fragment>
  );
}

export default TransactionsTable;
