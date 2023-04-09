import { Container } from "@mantine/core";
import { trpc } from "~/utils/trpc";

export default function Home() {
  const hello = trpc.hello.useQuery({ text: "client" });

  return (
    <Container>
      <h1 className="text-6xl font-bold">
        {hello.data ? hello.data.greeting : "loading..."}
      </h1>
    </Container>
  );
}
