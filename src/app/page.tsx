import Link from "next/link";

const Home = () => {

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Link href="/documents/234">
        here
      </Link>
      to go to document id
    </div>

  )
}


export default Home;