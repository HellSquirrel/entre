import React, { FC } from "react";

type Props = {
  name?: string;
  img?: string;
};

const Profile: FC<Props> = ({ name, img }) => (
  <div>
    <div>{name}</div>
    {!!img && <img src={img} /> }
  </div>
);

export default Profile;
