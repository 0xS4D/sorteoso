import Logo from './assets/logo'
import Form from './components/Form'

export default function App() {
  return (
    <div className='h-screen w-screen bg-cover sm:bg-bottom flex flex-col items-center p-5 sm:p-10 bg-[url("/img/bg.png")] bg-[0%_-3em]'>
      <Logo className='w-80 sm:w-60 md:w-72 lg:w-84 xl:w-96 mb-5' />
      <Form />
    </div>
  )
}
