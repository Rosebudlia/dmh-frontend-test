function initMajorPromos() {
    try {
        (new MajorPromoJamFm('.major-promo'));
    } catch(e) {
        console.error(e);
    }
}