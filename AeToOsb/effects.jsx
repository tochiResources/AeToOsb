// checks if the effect exists on a layer, returns true if they do
function effectExists(layer, effectName) {
    // Fill effect
    if (layer.Effects.numProperties != 0) {
        if (effectName.match(new RegExp("(Fill)", "i"))) {
            if (layer.effect("Fill")("Color")) {
                if (layer.effect("Fill")("Color").canSetExpression) {
                    return true;
                }
            }
            else return false;
        }
        else return false;
    }
    else return false;
}