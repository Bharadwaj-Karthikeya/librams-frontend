import { classNames } from "../../utils/helpers";

export default function Card({ children, className }) {
  return (
    <div className={classNames("p-6", className)}>
      {children}
    </div>
  );
}
