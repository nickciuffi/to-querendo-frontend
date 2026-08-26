// Importe o Card e subcomponentes com base no caminho onde salvou o arquivo
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction
} from "@/components/ui/card"

function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-amber-800">
      <section>
          <p className="text-blue-100 mb-5">To Querendo!!!</p>
      <Card>
        <CardHeader>
          <CardTitle>Card Foda</CardTitle>
          <CardDescription>Olha o milho</CardDescription>
          <CardAction>
            <button>R$ 10,00</button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <p>Com manteiga e tudo mais</p>
        </CardContent>

        <CardFooter>
          <button>Comprar</button>
        </CardFooter>
      </Card>

      </section>
    </div>
  )
}

export default App

