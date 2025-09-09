import React from "react";
import Container from "./Container";
import HeaderMenu from "./HederMenu";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import CardIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobilMenu from "./MobilMenu";


const Header = async () => {
  // const user = await currentUser();

  return (
    <header className="bg-white py-5 border-b border-b-black/20">
      <Container className="flex items-center justify-between text-lightColor ">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobilMenu />
          <Logo logoSrc={'/logo.png'}/>
        </div>

        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-8 p-1">
          <SearchBar />
          <CardIcon />
          <FavoriteButton />
        </div>
       
          
          {/* {!user && <SignIn />} */}
      
      </Container>
    </header>
  );
};

export default Header;
