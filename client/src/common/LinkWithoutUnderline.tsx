import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';

const LinkWithoutUnderline = (props: LinkProps) => <Link style={{ textDecoration: 'none' }} {...props} />;

export default LinkWithoutUnderline;
