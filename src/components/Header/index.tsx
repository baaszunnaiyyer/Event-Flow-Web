import { useState } from "react";
import { Row, Col, Drawer } from "antd";
import { withTranslation, TFunction } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Container from "../../common/Container";
import { SvgIcon } from "../../common/SvgIcon";
import { Button } from "../../common/Button";
import {
  HeaderSection,
  LogoContainer,
  Burger,
  NotHidden,
  Menu,
  CustomNavLinkSmall,
  Label,
  Outline,
  Span,
} from "./styles";

const Header = ({ t }: { t: TFunction }) => {
  const [visible, setVisibility] = useState(false);
  const { user, logout } = useAuth();
  const history = useHistory();

  const toggleButton = () => {
    setVisibility(!visible);
  };

  const handleLogout = async () => {
    await logout();
    history.push("/");
    setVisibility(false);
  };

  const MenuItem = () => {
    const scrollTo = (id: string) => {
      const element = document.getElementById(id) as HTMLDivElement;
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }
      setVisibility(false);
    };
    return (
      <>
        <CustomNavLinkSmall onClick={() => scrollTo("about")}>
          <Span>{t("About")}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={() => scrollTo("mission")}>
          <Span>{t("Mission")}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={() => scrollTo("product")}>
          <Span>{t("Product")}</Span>
        </CustomNavLinkSmall>
        <CustomNavLinkSmall onClick={() => scrollTo("contact")}>
          <Span>{t("Contact")}</Span>
        </CustomNavLinkSmall>
        {user ? (
          <>
            <CustomNavLinkSmall onClick={() => { history.push("/settings"); setVisibility(false); }}>
              <Span>Profile</Span>
            </CustomNavLinkSmall>
            <CustomNavLinkSmall onClick={handleLogout}>
              <Span>Logout</Span>
            </CustomNavLinkSmall>
          </>
        ) : (
          <CustomNavLinkSmall onClick={() => { history.push("/login"); setVisibility(false); }}>
            <Span>
            {t("Login")}
            </Span>
          </CustomNavLinkSmall>
        )}
      </>
    );
  };

  return (
    <HeaderSection>
      <Container>
        <Row justify="space-between">
          <LogoContainer to="/" aria-label="homepage">
            <SvgIcon src="logo.svg" width="101px" height="64px" />
          </LogoContainer>
          <NotHidden>
            <MenuItem />
          </NotHidden>
          <Burger onClick={toggleButton}>
            <Outline />
          </Burger>
        </Row>
        <Drawer closable={false} open={visible} onClose={toggleButton}>
          <Col style={{ marginBottom: "2.5rem" }}>
            <Label onClick={toggleButton}>
              <Col span={12}>
                <Menu>Menu</Menu>
              </Col>
              <Col span={12}>
                <Outline />
              </Col>
            </Label>
          </Col>
          <MenuItem />
        </Drawer>
      </Container>
    </HeaderSection>
  );
};

export default withTranslation()(Header);
