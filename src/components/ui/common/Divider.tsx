type Props = {
  horizontal?: boolean;
};
const Divider = (props: Props) => {
  const { horizontal } = props;
  return (
    <div
      className={`divider ${
        horizontal ? 'divider-horizontal' : 'divider-vertical'
      }`}></div>
  );
};

export default Divider;
