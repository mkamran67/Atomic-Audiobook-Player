import TimeLine from "../home/TimeLine";

type Props = {};

export default function Home({ }: Props) {
  return (
    <div className="flex w-full h-full">
      <section className="w-3/4 h-full bg-gray-800">
        <h3 className="p-2 text-xl text-ellipsis">
          Continue Reading
        </h3>
      </section>
      <section className="m-2">
        <TimeLine />
      </section>
    </div>
  );
}
