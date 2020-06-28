import Table from 'react-bootstrap/Table';
import { useTable, useGlobalFilter, useSortBy, usePagination } from "react-table";
import { useStorage } from '../hooks/useStorage'

export default function({ columns, data, globalFilter, pageSizes, ...props }) {
  const { storage, setPageSize: savePageSize } = useStorage()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setGlobalFilter,
    preGlobalFilteredRows,
    visibleColumns,
    state,
    rows,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: storage.pageSize },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <>
      <Table {...props} {...getTableProps()}>
        {/* Header */}
        <thead className="noselect">
          {globalFilter &&
            <tr>
              <th colSpan={visibleColumns.length}>
                <span className={'section'}>
                  Поиск:{' '}
                  <input
                    value={state.globalFilter || ''}
                    onChange={e => { setGlobalFilter(e.target.value || undefined) }}
                  />
                </span>
                <span style={{ fontWeight: 'normal' }}>
                  {rows.length} из {preGlobalFilteredRows.length} записей...
                </span>
              </th>
            </tr>
          }
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc ? 'sort-desc' : 'sort-asc'
                      : ''
                  }
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {/* Body */}
        <tbody {...getTableBodyProps()}>
          {(pageSizes ? page : rows).map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        {/* Footer */}
        {pageSizes &&
          <tfoot>
            <tr>
              <td colSpan={visibleColumns.length}>
                <div className={'align-right'}>
                  <span className={'section'}>
                    Page size:{' '}
                    <select
                      value={pageSize}
                      onChange={e => {
                        const size = Number(e.target.value)
                        setPageSize(size)
                        savePageSize(size)
                      }}
                    >
                      {pageSizes.map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </span>
                  <span className={'section'}>
                    Page <strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length}</strong>{' '}
                  </span>
                  <span className={'section'}>
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                      {'<<'}
                    </button>{' '}
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                      {'<'}
                    </button>{' '}
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                      {'>'}
                    </button>{' '}
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                      {'>>'}
                    </button>
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        }
      </Table>

      <style jsx>{`
        .noselect {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        th.sort-desc:after, th.sort-asc:after {
          content: '';
          position: relative;
          left: 2px;
          border: 6px solid transparent;
        }

        th.sort-desc:after {
          top: 10px;
          border-top-color: grey;
        }

        th.sort-asc:after {
          bottom: 15px;
          border-bottom-color: grey;
        }

        div.align-right {
          text-align: right;
        }

        span.section {
          margin-right: 1rem;
        }
      `}</style>
    </>
  );
}
