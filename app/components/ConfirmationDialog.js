//
// Provide a confirmation dialog for any action
//

import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

const ConfirmationDialog = props => {
  const [ state, setState ] = useState({ open: false, callback: null })

  const show = callback => event => {
    event.preventDefault()

    event = {
      ...event,
      target: { ...event.target, value: event.target.value }
    }

    setState({
      open: true,
      callback: () => callback(event)
    })
  }

  const hide = () => {
    setState({ open: false, callback: null })
  }

  const confirm = () => {
    state.callback()
    hide()
  }

  return (
    <>
      {props.children(show)}
      <Modal backdrop={'static'} keyboard={false} show={state.open} {...props}>
        <Modal.Header>
          <Modal.Title>
            {props.header}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.description}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-secondary' onClick={hide}>{props.cancel || 'Отменить'}</Button>
          <Button variant='outline-danger' onClick={confirm}>{props.confirm || 'Подтвердить'}</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ConfirmationDialog


/*
  Example:

  const handleCancel = () => alert("Cancelled")
  const handleReset = event => alert("Resetted")

  {
    <ConfirmationDialog header='Confirm' description='Are you sure?'>
      {confirm => (
        <>
          <div>
            Произвольный компонент, которому доступна функция confirm с параметром-хэндлером события
          </div>
          <div>
            <Button variant='primary' onClick={confirm(handleCancel)}>{'Отменить'}</Button>
            <Button variant='danger' onClick={confirm(handleReset)}>{'Сбросить'}</Button>
          </div>
        </>
      )}
    </ConfirmationDialog>
  }


  Original delete confirmation using built-in option:

      <Button
        size='sm'
        className='mx-1'
        variant='outline-danger'
        onClick={() => {
          if (window.confirm('Удаление записи. Вы уверены?')) {
            onDelete(i)
          }
        }}
      >
        &#x274c;
      </Button>
*/
