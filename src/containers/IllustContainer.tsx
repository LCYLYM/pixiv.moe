import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import classNames from 'classnames';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Button
} from '@material-ui/core';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import shortid from 'shortid';
import Img from 'react-image';
import DocumentTitle from 'react-document-title';
import { FormattedMessage, injectIntl, InjectedIntl } from 'react-intl';
// import honoka from 'honoka';

import config from '@/config';

import * as IllustActions from '@/actions/illust';
import { IIllustAction, TIllustThunkDispatch } from '@/actions/illust';
import * as GalleryActions from '@/actions/gallery';
// import Alert from '@/components/Alert';
import Comment from '@/components/Comment';
import GifPlayer from '@/components/GifPlayer';
import InfiniteScroll from '@/components/InfiniteScroll';
import Loading from '@/components/Loading';
import Message from '@/components/Message';
import Content from '@/components/Content';
// import LoginContainer from '@/containers/LoginContainer';
import moment from '@/utils/moment';
import Storage from '@/utils/Storage';
import getProxyImage from '@/utils/getProxyImage';
import { ICombinedState } from '@/reducers';
import { IIllustState } from '@/reducers/illust';

const styles = createStyles({
  illust: {
    padding: 20
  },
  link: {
    cursor: 'default'
  },
  image: {
    overflow: 'hidden',
    textAlign: 'center',
    '& img': {
      position: 'relative',
      marginTop: 0,
      marginRight: 'auto',
      marginBottom: 10,
      marginLeft: 'auto',
      maxWidth: '100%',
      boxShadow:
        '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
      border: 0,
      zIndex: 1,
      transition: 'opacity 0.3s ease',
      '@media screen and (max-width: 768px) and (orientation: portrait)': {
        width: '100%'
      },
      '@media screen and (max-width: 1024px) and (orientation: landscape)': {
        width: '100%'
      }
    }
  },
  caption: {
    margin: 15,
    textAlign: 'center',
    '& p': {
      lineHeight: '18px'
    }
  },
  tags: {
    margin: 15,
    textAlign: 'center'
  },
  tagItem: {
    margin: 5,
    '& div': {
      color: 'rgb(255, 255, 255) !important',
      backgroundColor: 'rgb(0, 150, 136) !important'
    }
  },
  actions: {
    margin: 15,
    textAlign: 'center',
    '& button': {
      margin: 8
    }
  },
  detail: {
    textAlign: 'center',
    color: 'rgb(255, 64, 129)',
    '& time': {
      marginLeft: 10,
      color: '#999'
    },
    '& a': {
      textDecoration: 'none'
    }
  },
  author: {
    display: 'inline-block',
    '&:before': {
      content: '"by"',
      marginRight: 5
    },
    '& a': {
      color: '#258fb8'
    }
  },
  metas: {
    color: '#666'
  },
  divide: {
    '&:not(:first-child)': {
      marginLeft: 4,
      paddingLeft: 4,
      borderLeft: '1px solid #ccc'
    }
  },
  comments: {
    width: '100%'
  },
  commentList: {
    display: 'block',
    padding: '8px 0',
    listStyle: 'none'
  }
});

interface IIllustContainerRouteInfo {
  illustId: string;
}

type IIllustContainerCombinedProps = WithStyles<typeof styles> &
  RouteComponentProps<IIllustContainerRouteInfo>;

interface IIllustContainerProps extends IIllustContainerCombinedProps {
  dispatch: Dispatch<IIllustAction> & TIllustThunkDispatch;
  intl: InjectedIntl;
  illust: IIllustState;
}

interface IIllustContainerState {
  isSubmitting: boolean;
}

class IllustContainer extends React.Component<
  IIllustContainerProps,
  IIllustContainerState
> {
  illustId: string;
  authTimer: number;

  constructor(props: IIllustContainerProps) {
    super(props);

    this.state = {
      isSubmitting: false
    };

    this.illustId = this.props.match.params.illustId;
  }

  componentDidMount() {
    if (!this.item.id) {
      this.props.dispatch(IllustActions.fetchItem(this.illustId));
    }

    this.props.dispatch(IllustActions.fetchComments(this.illustId));
    this.authTimer = window.setInterval(() => {
      const authData = Storage.get('auth');
      if (authData === null) {
        return;
      }
      if (authData.expires_at < moment().unix()) {
        Storage.remove('auth');
      }
    }, 500);
  }

  componentWillUnmount() {
    this.props.dispatch(IllustActions.clearComments());
    clearInterval(this.authTimer);
  }

  get item() {
    if (!this.props.illust.items[this.illustId]) {
      return {
        title: ''
      };
    }
    return this.props.illust.items[this.illustId];
  }

  onBackClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.history.length > 1) {
      this.props.history.goBack();
    } else {
      this.props.history.push('/');
    }
  };

  // @autobind
  // onFavouriteClick() {
  //   const authData = Storage.get('auth');
  //   if (authData === null || authData.expires_at < moment().unix()) {
  //     return this.loginRef.open();
  //   }

  //   this.setState({
  //     isSubmitting: true
  //   });
  //   honoka
  //     .put(`${config.favouriteURI}/${this.illustId}`, {
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //         'Access-Token': authData.access_token
  //       }
  //     })
  //     .then(data => {
  //       this.setState({
  //         isSubmitting: false
  //       });
  //       this.alertRef.setContent(data.message);
  //     })
  //     .catch(() => {
  //       this.setState({
  //         isSubmitting: false
  //       });
  //       this.alertRef.setContent(
  //         this.props.intl.formatMessage({ id: 'Communication Error Occurred' })
  //       );
  //     });
  // }

  onDownloadClick = () => {
    const tempLink = document.createElement('a');
    tempLink.href = getProxyImage(this.item.image_urls.large);
    tempLink.setAttribute('download', `${this.item.title}.jpg`);
    tempLink.setAttribute('target', '_blank');
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  };

  onTwitterClick = () => {
    window.open(
      `https://twitter.com/intent/tweet?original_referer=${encodeURIComponent(
        window.location.href
      )}&ref_src=twsrc%5Etfw&text=${encodeURIComponent(
        `${this.item.title} | ${this.item.user.name} #pixiv`
      )}&tw_p=tweetbutton&url=${encodeURIComponent(
        `${config.baseURL}${this.item.id}`
      )}`,
      '_blank',
      'width=550,height=370'
    );
  };

  onTagClick = (tag: string) => {
    this.props.dispatch(GalleryActions.setWord(tag));
    this.props.dispatch(GalleryActions.setFromIllust(true));
    this.props.history.push('/');
  };

  renderImage() {
    if (this.item.meta_pages && this.item.meta_pages.length > 0) {
      return this.item.meta_pages.map((elem: any) => {
        return (
          <Img
            key={shortid.generate()}
            src={[
              getProxyImage(elem.image_urls.large),
              getProxyImage(elem.image_urls.medium)
            ]}
            loader={<Loading isHidden={false} />}
          />
        );
      });
    }
    if (this.item.meta_pages && this.item.meta_pages.length === 0) {
      return (
        <Img
          src={[
            getProxyImage(this.item.image_urls.large),
            getProxyImage(this.item.image_urls.medium)
          ]}
          loader={<Loading isHidden={false} />}
        />
      );
    }

    if (
      this.item.metadata &&
      this.item.metadata.zip_images &&
      this.item.metadata.zip_images.length > 0
    ) {
      return <GifPlayer images={this.item.metadata.zip_images} />;
    }
  }

  renderContent() {
    const { classes } = this.props;

    if (this.props.illust.isFetching) {
      return <Loading isHidden={false} />;
    }
    if (this.props.illust.isError) {
      return (
        <Message
          isHidden={false}
          text={this.props.intl.formatMessage({ id: 'An Error Occurred' })}
        />
      );
    }
    try {
      return (
        <div className={classes.illust}>
          <div className={classes.image}>{this.renderImage()}</div>
          <div className={classes.caption}>
            {typeof this.item.caption === 'string' &&
              (this.item.caption as string)
                .replace(/(\r\n|\n\r|\r|\n)/g, '\n')
                .split('\n')
                .map(elem => (
                  <p
                    key={shortid.generate()}
                    dangerouslySetInnerHTML={{
                      __html: elem
                    }}
                  />
                ))}
          </div>
          <div className={classes.tags}>
            {this.item.tags.map((elem: any) => {
              return (
                <Chip
                  key={shortid.generate()}
                  className={classes.tagItem}
                  avatar={<Avatar>#</Avatar>}
                  label={elem.name}
                  onClick={() => this.onTagClick(elem.name)}
                  clickable
                />
              );
            })}
          </div>
          <div className={classes.actions}>
            {/* <Button
              variant="contained"
              onClick={this.onFavouriteClick}
              disabled={this.state.isSubmitting}>
              <FormattedMessage id="Add to Bookmarks" />
            </Button> */}
            <Button variant="contained" onClick={this.onDownloadClick}>
              <FormattedMessage id="Download" />
            </Button>
            <Button variant="contained" onClick={this.onTwitterClick}>
              <FormattedMessage id="Tweet" />
            </Button>
          </div>
          <div className={classes.detail}>
            <div>
              <div className={classes.author}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`http://pixiv.me/${this.item.user.account}`}>
                  {this.item.user.name}
                </a>
              </div>
              <time>
                {`${moment(this.item.created_time).format('LLL')}(JST)`}
              </time>
              <div className={classes.metas}>
                <span
                  className={
                    classes.divide
                  }>{`${this.item.width}x${this.item.height}`}</span>
                {Array.isArray(this.item.tools) && (
                  <span
                    className={classNames({
                      [classes.divide]:
                        Array.isArray(this.item.tools) &&
                        this.item.tools.length > 0
                    })}>
                    {this.item.tools.join(' / ')}
                  </span>
                )}
              </div>
            </div>
            <p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`/${this.item.id}`}>
                <FormattedMessage id="Redirect to pixiv" />
              </a>
            </p>
          </div>
          <InfiniteScroll
            distance={200}
            onLoadMore={() =>
              this.props.dispatch(IllustActions.fetchComments(this.illustId))
            }
            isLoading={this.props.illust.isFetchingComments}
            hasMore={!this.props.illust.isCommentsEnd}>
            <div className={classes.comments}>
              <h4>
                <FormattedMessage
                  id={
                    this.props.illust.comments.length === 0
                      ? 'No Comments'
                      : 'Comments'
                  }
                />
              </h4>
              <ul className={classes.commentList}>
                {this.props.illust.comments.map(elem => {
                  return <Comment key={shortid.generate()} item={elem} />;
                })}
              </ul>
              <Loading isHidden={!this.props.illust.isFetchingComments} />
            </div>
          </InfiniteScroll>
          {/* <LoginContainer onRef={ref => (this.loginRef = ref)} /> */}
          {/* <Alert onRef={ref => (this.alertRef = ref)} /> */}
        </div>
      );
    } catch (e) {
      return (
        <Message
          isHidden={false}
          text={this.props.intl.formatMessage({ id: 'An Error Occurred' })}
        />
      );
    }
  }

  render() {
    return (
      <DocumentTitle
        title={this.item.title === '' ? config.siteTitle : this.item.title}>
        <>
          <AppBar position="static">
            <Toolbar>
              <IconButton href="#" color="inherit" onClick={this.onBackClick}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" color="inherit">
                {this.item.title}
              </Typography>
            </Toolbar>
          </AppBar>
          <Content>{this.renderContent()}</Content>
        </>
      </DocumentTitle>
    );
  }
}

export default connect((state: ICombinedState) => ({ illust: state.illust }))(
  injectIntl(withStyles(styles)(IllustContainer))
);
