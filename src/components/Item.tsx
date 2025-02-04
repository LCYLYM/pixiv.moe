import React from 'react';
import classNames from 'classnames';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import StarIcon from '@material-ui/icons/Star';
import getProxyImage from '@/utils/getProxyImage';

const styles = createStyles({
  cell: {
    width: 175,
    minHeight: 100,
    padding: 0,
    background: '#fff',
    margin: 8,
    marginTop: 10,
    fontSize: 12,
    boxShadow:
      '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
    textAlign: 'center',
    '&:hover': {
      boxShadow: '0 1px 5px rgba(34, 25, 25, 0.8)'
    },
    '@media screen and (max-width: 400px)': {
      width: 160
    },
    '@media screen and (max-width: 320px)': {
      width: 140
    }
  },
  link: {
    textDecoration: 'none'
  },
  imageWrapper: {
    overflow: 'hidden',
    '& img': {
      display: 'block',
      width: '100%',
      height: '100%',
      border: 0,
      maxWidth: '100%',
      background: '#ccc',
      transition: 'opacity 0.5s ease, transform 0.2s ease',
      '&:hover': {
        transform: 'scale(1.05)'
      }
    }
  },
  title: {
    margin: '1px 0',
    fontSize: 16,
    lineHeight: 1,
    '& span': {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#000',
      textDecoration: 'none'
    }
  },
  meta: {
    lineHeight: 1,
    padding: '0 0 1px',
    margin: '8px 0',
    fontSize: 10,
    '& span': {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#000',
      textDecoration: 'none'
    },
    '& svg': {
      fontSize: 20
    }
  },
  count: {
    color: '#0069b1 !important',
    backgroundColor: '#cceeff',
    borderRadius: 3,
    margin: '0 1px',
    padding: '0 6px',
    '& svg': {
      verticalAlign: 'middle',
      position: 'relative',
      top: '-.1em',
      fontSize: 14
    }
  },
  rankNum: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 16
  },
  rankTextOuter: {
    color: '#757575',
    verticalAlign: 1,
    marginLeft: 3
  },
  noPreviousRank: {
    color: '#f44336'
  }
});

interface IItemProps extends WithStyles<typeof styles> {
  item: any;
  index: number;
  masonry: any;
}

const Item = withStyles(styles)(
  class Item extends React.Component<IItemProps> {
    imgRef: HTMLImageElement;

    get classes() {
      return this.props.classes;
    }

    onImageMouseMove(event: React.MouseEvent) {
      const nativeEvent = event.nativeEvent;
      const target = event.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'img') {
        target.style.transformOrigin = `${nativeEvent.offsetX}px ${nativeEvent.offsetY}px`;
      }
    }

    onImageError = () => {
      this.imgRef.src = require('@/images/img-fail.jpg');
      typeof this.props.masonry !== 'undefined' &&
        this.props.masonry.performLayout();
    };

    renderRankText() {
      const { classes } = this.props;
      if (this.props.item.previous_rank === 0) {
        return (
          <span
            className={classNames(
              classes.rankTextOuter,
              classes.noPreviousRank
            )}>
            <FormattedMessage id="Debut" />
          </span>
        );
      }

      const icon =
        this.props.item.previous_rank < this.props.item.rank ? (
          <TrendingDownIcon style={{ color: '#3f51b5' }} />
        ) : (
          <TrendingUpIcon style={{ color: '#d32f2f' }} />
        );

      return (
        <span className={classes.rankTextOuter}>
          {icon}
          <FormattedMessage
            id="Yesterday x rank"
            values={{ rank: this.props.item.previous_rank }}
          />
        </span>
      );
    }

    render() {
      // const isRank = this.props.item.hasOwnProperty('work');
      const isRank = false;
      const classes = this.props.classes;

      return (
        <div className={classes.cell} onMouseMove={this.onImageMouseMove}>
          <Link
            className={classes.link}
            to={`/illust/${
              isRank ? this.props.item.work.id : this.props.item.id
            }`}>
            <div className={classes.imageWrapper}>
              <img
                ref={ref => (this.imgRef = ref as HTMLImageElement)}
                src={getProxyImage(this.props.item.image_urls.medium)}
                onError={this.onImageError}
              />
            </div>
            <div className={classes.title}>
              <span>
                {isRank ? this.props.item.work.title : this.props.item.title}
              </span>
            </div>
            {isRank ? (
              <div className={classes.meta}>
                <span className={classes.rankNum}>
                  <FormattedMessage
                    id="x rank"
                    values={{ rank: this.props.item.rank }}
                  />
                </span>
                <span>{this.renderRankText()}</span>
              </div>
            ) : (
              <div className={classes.meta}>
                <span className={classes.count}>
                  <StarIcon />
                  {this.props.item.total_bookmarks}
                </span>
              </div>
            )}
          </Link>
        </div>
      );
    }
  }
);

export default Item;
