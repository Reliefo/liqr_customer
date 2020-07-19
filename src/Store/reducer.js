import * as TYPES from "./actionTypes.js";

function reducer(state, action) {
  let st = { ...state };
  const { payload } = action;
  let idx;
  switch (action.type) {
    case TYPES.UPDATE_HOME_ITEMS:
      st.homeItems = payload;
      return st;
    case TYPES.UPDATE_TABLE_CART:
      st.tableCartOrders = payload;
      return st;
    case TYPES.UPDATE_SUCCESS_ORDER:
      st.orderSuccess.push(payload);
      return st;

    case TYPES.REFRESH_ORDER_CLOUD:
      st.orderSuccess = [];
      st.orderSuccess = payload;
      return st;

    case TYPES.ADDONS:
      st.addons = [];
      st.addons = payload;
      return st;

    case TYPES.SET_RESTAURANT_NAME:
      st.restName = payload;
      return st;

    case TYPES.UPDATE_TABLE_USERS:
      st.tableUsers = payload;
      return st;
    case TYPES.SET_PLACEORDER_ID:
      st.placeOrderById = payload.users;
      return st;

    case TYPES.SET_TABLE_ID:
      st.tableId = payload._id.$oid;
      return st;
    case TYPES.UPDATE_ORDER_STATUS:
      st.orderSuccess.forEach((item, index) => {
        if (item._id.$oid === payload.table_order_id) {
          item.orders.forEach((item1) => {
            if (item1._id.$oid === payload.order_id) {
              item1.food_list.forEach((item2) => {
                if (item2.food_id === payload.food_id) {
                  item2.status = payload.type;
                  st.orderSuccess[index] = item;
                }
              });
            }
          });
        }
      });

      return st;
    case TYPES.UPDATE_FOOD_MENU:
      st.rawData.food_menu = payload;
      return st;
    case TYPES.UPDATE_TABLE_NAME:
      st.tableName = payload;
      return st;
    case TYPES.ADD_DATA:
      st.rawData = payload;
      return st;
    case TYPES.ADD_TO_CART_DATA:
      return {
        ...st,
        cartData: payload,
      };
    case TYPES.ADD_ITEM:
      let newCartItem = payload;
      let foodId = newCartItem._id.$oid;
      if (newCartItem.currentCustomization !== undefined) {
        let price = 0;
        foodId += "#";
        newCartItem.currentCustomization.forEach((cust, custIndex) => {
          cust.list_of_options.forEach((option, optionIndex) => {
            if (cust.checked[optionIndex]) {
              foodId += custIndex.toString() + optionIndex.toString();

              if (cust.customization_type === "options") {
                price += parseFloat(option.option_price);
              }
              if (cust.customization_type === "add_ons") {
                price += parseFloat(option.price);
              }
            }
          });
        });
        if (price === 0) {
          price = newCartItem.price;
        } else {
          newCartItem.price = price;
        }
      }
      newCartItem["foodId"] = foodId;
      let cartIdx = st.cart.findIndex(
        (cartItem) => cartItem.foodId === newCartItem.foodId
      );
      console.log(newCartItem);

      if (cartIdx === -1) {
        st.cart.push({
          ...newCartItem, //payload is the id
          quantity: 0,
        });
        st.cart = st.cart.map((cartItem) => {
          if (cartItem.foodId === newCartItem.foodId) {
            ++cartItem.quantity;
          }
          return cartItem;
        });
        // return newCartItem;
      } else {
        st.cart = st.cart.map((cartItem) => {
          if (cartItem.foodId === newCartItem.foodId) {
            ++cartItem.quantity;
          }
          return cartItem;
        });
      }
      return st;
    case TYPES.INC_ITEM:
      st.cart = st.cart.map((cartItem) => {
        if (cartItem.foodId === payload) ++cartItem.quantity;
        return cartItem;
      });

      return st;
    case TYPES.DEC_ITEM:
      st.cart = st.cart.map((cartItem) => {
        if (cartItem.foodId === payload) --cartItem.quantity;
        return cartItem;
      });
      // }
      return st;
    case TYPES.DEL_ITEM:
      idx = st.cart.findIndex((cartItem) => cartItem.foodId === payload);
      if (idx !== -1) st.cart.splice(idx, 1);

      return st;

    case TYPES.DEL_TABLE_ITEM:
      idx = st.tableCartOrders.orders.findIndex((item) =>
        item.food_list.map((item1) => item1.food_id === payload.food_id)
      );

      if (idx !== -1) st.tableCartOrders.orders.splice(idx, 1);

      return st;

    case TYPES.UPDATE_REST_ID:
      st.restId = payload;
      return st;

    case TYPES.UPDATE_MENU_CLICK:
      st.menuClick = payload;
      return st;

    case TYPES.UPDATE_FAB_CLICK:
      st.fabClick = payload;
      return st;

    case TYPES.SET_NAV:
      st.activeNav = payload;
      return st;
    case TYPES.ADD_COLLECTIVE_FOODITEMS:
      st.justMenuItems = payload;
      return st;
    case TYPES.ADD_COLLECTIVE_BARITEMS:
      st.justBarItems = payload;
      return st;
    case TYPES.SET_GENERAL_DATA:
      return { ...st, ...payload };

    case TYPES.SET_DINE_HISTORY:
      st.dineHistory = payload;
      return st;

    case TYPES.RESET_CART:
      st.cart = [];
      return st;

    case TYPES.ADD_REST_ADDRESS:
      st.restAddress = payload;
      return st;
    case TYPES.ADD_REST_IMAGES:
      st.restImages = payload;
      return st;
    case TYPES.ADD_REST_LOGO:
      st.restLogo = payload;
      return st;
    case TYPES.ORDERING_ABILITY:
      st.orderingAbility = payload;
      return st;
    case TYPES.DISPLAY_ORDER_BUTTONS:
      st.displayOrderButtons = payload;
      return st;
    case TYPES.THEME_PROPERTIES:
      st.themeProperties = payload;
      return st;
    case TYPES.BAR_FOOD_MENU_CATS:
      st.barFoodMenuCats = payload;
      return st;
    case TYPES.CURRENT_MENU:
      st.currentMenu = payload;
      return st;
    case TYPES.OPERATING_CURRENCY:
      st.currency = payload;
      return st;
    case TYPES.ADD_REST_TAXES:
      st.taxes = payload;
      return st;
    default:
      return state;
  }
}

export default reducer;
