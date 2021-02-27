import PropTypes from "prop-types";


const Header = ({ title }) => {
  const onClick = () => {
    console.log("Click");
  };

  return (
    <header className="header">
      <h2>{title}</h2>
    </header>
  );
};

Header.defaultProps = {
  title: "Digital Display Configuration Tool",
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
