import { NavLink } from "react-router";
import { formatDate } from "~/libs/formatDate";

interface CardProps {
  title: string;
  image_url: string;
  date: string;
  id: string
}

export default function NewCard(props: CardProps) {
  return (
    <div className="flex flex-col w-full bg-neutral-700 rounded-lg h-52 gap-2 border-2 border-neutral-500">
      <img
        src={props.image_url}
        alt={props.title}
        className="w-full h-32 object-cover rounded-tl-lg rounded-tr-lg"
      />
      <div className="flex flex-col">
        <NavLink to={`/news/${props.id}`}>
          <p className="text-white text-lg font-semibold pl-3">
            {props.title}
          </p>
        </NavLink>
        <p className="text-sm pl-3">{formatDate(props.date)}</p>
      </div>
    </div>
  );
}
