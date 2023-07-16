import './App.css'
import "ptrajectory-mpesa-payments-ui/styles.css"
import { PaymentForm } from 'ptrajectory-mpesa-payments-ui'

function App() {

  return (
    <>
      <PaymentForm
        amount={1000} // amount in KES
        onFormSubmit={(data)=>{
          console.log(data) // this is where you handle the form data
        }}
        additional_fields={{
          // by default this can be left empty and the phone number will be the only field
          // you can add more fields here and they will be added to the form
          // pass in the default value if you already have the data
          first_name: {
            default_value: "Joe"
          },
          last_name: {
            default_value: "Doe"
          },
          email: {
            default_value: "cooljoe@email.com"
          }
        }}
      />
    </>
  )
}

export default App
