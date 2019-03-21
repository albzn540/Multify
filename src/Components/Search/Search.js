import React from 'react';
import { compose } from 'recompose';
import {
  withStyles,
  Grid,
} from '@material-ui/core';

import SearchBar from '../SearchBar';
import SearchList from '../SearchList';

const styles = theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.black.main,
  },
});

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ searchString: event.value });
  }

  render() {
    const { classes } = this.props;
    const { searchString } = this.state;

    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.root}
        spacing={16}
      >
        <SearchBar onChange={this.handleChange} />
        <SearchList searchString={searchString} />
      </Grid>
    );
  }
}

export default compose(
  withStyles(styles),
)(Search);
