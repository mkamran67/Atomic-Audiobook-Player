type Props = {
  title: string;
  image: string | undefined;
  bookPath: string;
  artist: string;
};

export default function BookCard({ title, image, bookPath, artist }: Props) {
  return (
    <div className="shadow-xl card w-96 bg-base-100 image-full">
      <figure>
        <img src={image ? image : "C:/Users/lightberry/Downloads/default-book-cover.jpg"} alt={"Book cover"} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{bookPath}</p>
        <div className="justify-end card-actions">
          <button className="btn btn-primary">Play</button>
        </div>
      </div>
    </div>
  );
}
