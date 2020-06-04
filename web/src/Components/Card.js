import React from "react";
import PropTypes from "prop-types";
import "font-awesome/css/font-awesome.min.css";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  background-image: linear-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.7)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  border-radius: 8px;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  background-position: center center;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  color: white;
  margin-top: 40px;
`;

const ContentColumn = styled.div``;

const Title = styled.span`
  font-size: 24px;
  font-weight: 900;
  display: block;
  margin-bottom: 8px;
  color: ${(props) => props.color};
`;

const Subtitle = styled.span`
  font-size: 14px;
  color: ${(props) => props.color};
`;

const TagContainer = styled.div`
  background-color: ${(props) => props.tagBg};
  color: ${(props) => props.tagColor};
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  padding: 3px;
  width: 60px;
  border-radius: 3px;
  text-align: center;
  color: white;
`;

const TagText = styled.div``;

const IconContainer = styled.div`
  cursor: pointer;
  color: ${(props) => props.color};
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Card = ({
  item: {
    name,
    username,
    titleColor = "white",
    subtitleColor = "white",
    pod,
    tagBg = "#E33C36",
    tagColor = "white",
    html_url,
    iconSize = 3,
    iconColor = "white",
    avatar_url,
  },
}) => (
  <Container bgPhoto={avatar_url}>
    {pod && (
      <Top>
        <TagContainer tagBg={tagBg} tagColor={tagColor}>
          <TagText>{pod}</TagText>
        </TagContainer>
        {"fa fa-github" && (
          <IconContainer color={iconColor}>
            <a href={html_url}>
              <i className={`fa fa-github fa-${iconSize}x`} />
            </a>
          </IconContainer>
        )}
      </Top>
    )}
    {(name || username) && (
      <Content>
        <ContentColumn>
          {name && <Title color={titleColor}>{name}</Title>}
          {username && <Subtitle color={subtitleColor}>{username}</Subtitle>}
        </ContentColumn>
      </Content>
    )}
  </Container>
);

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  tag: PropTypes.string,
  tagBg: PropTypes.string,
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  bgPhoto: PropTypes.string,
};

export default Card;
