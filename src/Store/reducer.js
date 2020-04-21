import * as TYPES from "./actionTypes.js";

function reducer(state, action) {
  let st = { ...state };
  const { payload } = action;
  let idx;
  switch (action.type) {
    case TYPES.SET_PLACEORDER_ID:
      st.placeOrderById = payload.users;
      return st;

    case TYPES.SET_TABLE_ID:
      st.tableId = payload._id.$oid;
      return st;
    case TYPES.UPDATE_ORDER_STATUS:
      st.orderStatus.push({
        payload
      });

      return st;
    case TYPES.UPDATE_FOOD_MENU:
      st.rawData.food_menu = payload;
      return st;
    case TYPES.ADD_DATA:
      st.rawData = payload;
      return st;
    case TYPES.ADD_ITEM:
      idx = st.cart.findIndex(item => item._id.$oid === payload._id.$oid);
      if (idx === -1) {
        st.cart.push({
          ...payload, //payload is the id
          quantity: 1
        });
      }
      return st;
    case TYPES.INC_ITEM:
      st.cart = st.cart.map(item => {
        if (item._id.$oid === payload) ++item.quantity;
        return item;
      });
      return st;
    case TYPES.DEC_ITEM:
      st.cart = st.cart.map(item => {
        if (item._id.$oid === action.payload) --item.quantity;
        return item;
      });
      return st;
    case TYPES.DEL_ITEM:
      idx = st.cart.findIndex(item => item._id.$oid === payload);
      st.cart.splice(idx, 1);
      return st;
    case TYPES.SET_NAV:
      st.activeNav = payload;
      return st;
    case TYPES.ADD_COLLECTIVE_FOODITEMS:
      st.justMenuItems = payload;
      return st;
    case TYPES.SET_GENERAL_DATA:
      return { ...st, ...payload };
    default:
      return state;
  }
}

export default reducer;
