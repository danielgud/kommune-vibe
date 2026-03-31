import { Button } from "./Button";
import Modal from "./Modal";

export interface Result {
  time: number;
  name: string;
}

interface TopListProps {
  top10: Result[];
  currentResult: Result;
  numberOfCards: number;
}

export const TopList = ({ top10, currentResult, numberOfCards }: TopListProps) => {
  return (
    <Modal>
      <h1 className="text-4xl font-bold mb-2">
        Bra jobbet, {currentResult.name}
      </h1>
      <p className="mb-4 text-lg">Toppliste for {numberOfCards} kort</p>

      <div>
        Du brukte <em>{currentResult.time.toFixed(1)}</em> sekunder. Her er topp 10:
      </div>

      <ol className="text-xl">
        {top10.map((entry, index) => (
          <li key={index} className="flex justify-between border-b-2 py-4">
            <span>
              {index + 1}. {entry.name} {index === 0 && "👑"}
            </span>
            <span>{entry.time.toFixed(1)} sekunder</span>
          </li>
        ))}
      </ol>

      <div className="flex gap-3 justify-center">
        <Button onClick={() => window.location.reload()}>Spill igjen</Button>
      </div>
    </Modal>
  );
};

export default TopList;
