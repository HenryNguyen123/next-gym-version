
"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from "@/lib/redux/features/slices/counter/counter.slice";

export default function CounterExample() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">
        Counter: {count}
      </h1>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => dispatch(increment())}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Increment
        </button>

        <button
          onClick={() => dispatch(decrement())}
          className="rounded bg-red-600 px-4 py-2 text-white"
        >
          Decrement
        </button>

        <button
          onClick={() => dispatch(incrementByAmount(5))}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          +5
        </button>

        <button
          onClick={() => dispatch(reset())}
          className="rounded border px-4 py-2"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
