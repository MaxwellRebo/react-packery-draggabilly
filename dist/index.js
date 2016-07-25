'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _packery = require('packery');

var _packery2 = _interopRequireDefault(_packery);

var _imagesloaded = require('imagesloaded');

var _imagesloaded2 = _interopRequireDefault(_imagesloaded);

var _draggabilly = require('draggabilly');

var _draggabilly2 = _interopRequireDefault(_draggabilly);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// https://github.com/MaxwellRebo/react-packery-draggabilly

var refName = 'packeryContainer';

var PackeryComponent = function (_Component) {
  _inherits(PackeryComponent, _Component);

  function PackeryComponent(props) {
    _classCallCheck(this, PackeryComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PackeryComponent).call(this, props));

    _this.initializePackery = function (force) {
      _this.packery = new _packery2.default(_this.refs[refName], _this.props.options);

      _this.packery.getItemElements().forEach(_this.makeEachDraggable);
      _this.domChildren = _this.getNewDomChildren();
    };

    _this.getNewDomChildren = function () {
      var node = _this.refs[refName];
      var children = _this.props.options.itemSelector ? node.querySelectorAll(_this.props.options.itemSelector) : node.children;
      return Array.prototype.slice.call(children);
    };

    _this.diffDomChildren = function () {
      var oldChildren = _this.domChildren.filter(function (element) {
        /*
         * take only elements attached to DOM
         * (aka the parent is the packery container, not null)
         */
        return !!element.parentNode;
      });

      var newChildren = _this.getNewDomChildren();

      var removed = oldChildren.filter(function (oldChild) {
        return !~newChildren.indexOf(oldChild);
      });

      var domDiff = newChildren.filter(function (newChild) {
        return !~oldChildren.indexOf(newChild);
      });

      var beginningIndex = 0;

      // get everything added to the beginning of the DOMNode list
      var prepended = domDiff.filter(function (newChild, i) {
        var prepend = beginningIndex === newChildren.indexOf(newChild);

        if (prepend) {
          // increase the index
          beginningIndex++;
        }

        return prepend;
      });

      // we assume that everything else is appended
      var appended = domDiff.filter(function (el) {
        return prepended.indexOf(el) === -1;
      });

      _this.domChildren = newChildren;

      return {
        old: oldChildren,
        new: newChildren,
        removed: removed,
        appended: appended,
        prepended: prepended
      };
    };

    _this.performLayout = function () {
      var diff = _this.diffDomChildren();

      if (diff.removed.length > 0) {
        _this.packery.remove(diff.removed);
      }

      if (diff.appended.length > 0) {
        _this.packery.appended(diff.appended);
        diff.appended.forEach(_this.makeEachDraggable);
      }

      if (diff.prepended.length > 0) {
        _this.packery.prepended(diff.prepended);
        diff.prepended.forEach(_this.makeEachDraggable);
      }
      _this.packery.reloadItems();
      _this.packery.layout();
    };

    _this.imagesLoaded = function () {
      if (_this.props.disableImagesLoaded) return;

      (0, _imagesloaded2.default)(_this.refs[refName], function (instance) {
        _this.packery.layout();
      });
    };

    _this.componentDidMount = function () {
      _this.initializePackery();
      _this.imagesLoaded();
    };

    _this.componentDidUpdate = function () {
      _this.performLayout();
      _this.imagesLoaded();
    };

    _this.componentWillReceiveProps = function () {
      _this._timer = setTimeout(function () {
        _this.packery.reloadItems();
        _this.packery.layout();
      });
    };

    _this.componentWillUnmount = function () {
      clearTimeout(_this._timer);
    };

    _this.render = function () {
      return _react2.default.createElement(_this.props.elementType, {
        className: _this.props.className,
        ref: refName
      }, _this.props.children);
    };

    _this.packery = false;
    _this.domChildren = [];
    _this.displayName = 'PackeryComponent';

    //bind this to all non-react functions
    //if not familiar, see https://github.com/goatslacker/alt/issues/283
    _this.initializePackery = _this.initializePackery.bind(_this);
    _this.makeEachDraggable = _this.makeEachDraggable.bind(_this);
    _this.imagesLoaded = _this.imagesLoaded.bind(_this);
    _this.performLayout = _this.performLayout.bind(_this);
    return _this;
  }

  _createClass(PackeryComponent, [{
    key: 'makeEachDraggable',
    value: function makeEachDraggable(itemElem) {
      // make element draggable with Draggabilly
      var draggie = new _draggabilly2.default(itemElem);
      // bind Draggabilly events to Packery
      this.packery.bindDraggabillyEvents(draggie);
    }
  }]);

  return PackeryComponent;
}(_react.Component);

PackeryComponent.propTypes = {
  disableImagesLoaded: _react2.default.PropTypes.bool,
  options: _react2.default.PropTypes.object
};

PackeryComponent.defaultProps = {
  disableImagesLoaded: false,
  options: {},
  className: '',
  elementType: 'div'
};

module.exports = PackeryComponent;