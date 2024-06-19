import { useState } from "react";
import { ReloadIcon, CaretRightIcon } from "@radix-ui/react-icons";

import { SalesForceObject, generateFields } from "./ai";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

function App() {
  const [query, setQuery] = useState(
    "I'm a car dealer, I buy and sell second-hand luxury cars and I want to keep track of the cars flow and of my customers"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [objects, setObjects] = useState<SalesForceObject[]>([]);

  return (
    <main className="container mx-auto pt-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-extrabold text-4xl">
          <span className="text-indigo-500">🔨 Sales</span>
          <span className="text-slate-500">Forge.</span>
        </h1>

        <Button className="bg-green-600" disabled>
          Add fields
          <CaretRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          type="text"
          disabled={isLoading}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="flex-grow"
          placeholder="Describe your business needs..."
        />
        <Button
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            const args = await generateFields(query);

            setObjects(args || []);
            setIsLoading(false);
          }}
        >
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Generate Fields
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-3 mt-8">
        {objects.map((object) => (
          <div
            className="border-2 border-slate-600 rounded-lg bg-slate-200"
            key={object.name}
          >
            <div className="font-bold text-lg border-b-2 border-slate-600 p-4">
              {object.name}
            </div>
            {object.fields.map((field) => (
              <div key={field.name} className="p-4">
                <div className="font-bold text-base">{field.name}</div>
                <div className="text-sm">{field.type}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
