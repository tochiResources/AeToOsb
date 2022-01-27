$.evalFile('~/Documents/AeToOsb/array.generics.js');
function easingType(prop, k) {
    // keyInInterpolationType & keyOutInterpolationType::::::::::::::::
    // - BEZIER = 6613
    // - HOLD = 6614
    // - LINEAR = 6612

    // number of keyframes
    var keyCount = prop.numKeys;

    var type;
    var typeNext = false;
    var typePrev = false;
    var easingCount = 7;
    var threshold = 66.6 / easingCount;
    var sineTH = 33.4;
    var quadTH = sineTH + threshold;
    var cubicTH = quadTH + threshold;
    var quartTH = cubicTH + threshold;
    var quintTH = quartTH + threshold;
    var expoTH = quintTH + threshold;
    var circTH = expoTH + threshold;
    var backTH = circTH + threshold;
    var influence = keyInfluence(prop, k);
    var influenceNext = keyInfluenceAfter(prop, k);
    var influencePrev = keyInfluenceBefore(prop, k);

    var keyIn = influence[0];
    var keyOut = influence[1];
    var keyInNext = influenceNext[0];
    var keyOutPrev = influencePrev[1];

    if (influence.length != 0 && keyCount > 1) {
        if (k >= 1 && k < keyCount) {
            if (k == 1) {
                keyIn = keyOut;
                keyOut = keyInNext;
            }
            else {
                keyIn = influence[0];
                keyOut = influence[1];
            }
        }
        else if (k == keyCount) {
            keyIn = keyOutPrev;
            keyOut = influence[0];
        }
        else {
            keyIn = influence[0];
            keyOut = influence[1];
        }

        if (keyIn < 5 && keyOut < 5) { // None
            if (nextKeyHasInfluence()) {
                keyIn = keyOut;
                keyOut = keyInNext;
                if (k > 1)
                    type = "In";
                else type = "Out";
            }
            else if (prevKeyHasInfluence()) {
                keyOut = keyIn;
                keyIn = keyOutPrev;
                type = "In";
            }
            else type = "None";
        }
        else if (keyIn >= 5 && keyOut < 5) { // In
            if (nextKeyHasInfluence()) {
                keyIn = keyOut;
                keyOut = keyInNext;
                type = "InOut";
            }
            else if (prevKeyHasInfluence()) {
                keyOut = keyIn;
                keyIn = keyOutPrev;
                type = "In";
            }
            else type = "In";
        }
        else if (keyIn < 5 && keyOut >= 5) { // Out
            if (nextKeyHasInfluence()) {
                keyIn = keyOut;
                keyOut = keyInNext;
                type = "InOut";
            }
            else if (prevKeyHasInfluence()) {
                keyOut = keyIn;
                keyIn = keyOutPrev;
                type = "Out";
            }
            else type = "Out";
        }
        else if (keyIn >= 5 && keyOut >= 5) { // InOut
            if (nextKeyHasInfluence()) {
                keyIn = keyOut;
                keyOut = keyInNext;
                type = "InOut";
            }
            else if (prevKeyHasInfluence()) {
                keyOut = keyIn;
                keyIn = keyOutPrev;
                type = "In";
            }
            else type = "InOut";
        }

        function nextKeyHasInfluence() {
            if (influenceNext.length != 0 && (k >= 1 && k < keyCount)) {
                if (prop.keyInInterpolationType(k) == 6613) {
                    if (keyInNext < 5)
                        typeNext = false;
                    else if (keyInNext >= 5)
                        typeNext = true;
                }
                else typeNext = false;
                return typeNext;
            }
            else typeNext = false;
            return typeNext;
        }

        function prevKeyHasInfluence() {
            if (influencePrev.length != 0 && (k == keyCount)) {
                if (prop.keyInInterpolationType(k) == 6613) {
                    if (keyOutPrev < 5)
                        typePrev = false;
                    else if (keyOutPrev >= 5)
                        typePrev = true;
                }
                else typePrev = false;
                return typePrev;
            }
            else typePrev = false;
            return typePrev;
        }

        switch (type) {
            case "None":
                type = "None";
                break;
            case "In":
                if (prop.keyInInterpolationType(k) == 6613) {
                    if (keyIn < 5)
                        type = "None";
                    else if (keyIn >= 5 && keyIn < threshold)
                        type = "In";
                    else if (keyIn >= threshold && keyIn < sineTH)
                        type = type + "Sine";
                    else if (keyIn >= sineTH && keyIn < quadTH)
                        type = type + "Quad";
                    else if (keyIn >= quadTH && keyIn < cubicTH)
                        type = type + "Cubic";
                    else if (keyIn >= cubicTH && keyIn < quartTH)
                        type = type + "Quart";
                    else if (keyIn >= quartTH && keyIn < quintTH)
                        type = type + "Quint";
                    else if (keyIn >= quintTH && keyIn < expoTH)
                        type = type + "Expo";
                    else if (keyIn >= expoTH && keyIn < circTH)
                        type = type + "Circ";
                    else if (keyIn >= circTH && keyIn < backTH)
                        type = type + "Back";
                    else if (keyIn >= backTH)
                        type = type + "Back";
                }
                else type = "None";
                break;
            case "Out":
                if (prop.keyOutInterpolationType(k) == 6613) {
                    if (keyOut < 5)
                        type = "None";
                    else if (keyOut >= 5 && keyOut < threshold)
                        type = "Out";
                    else if (keyOut >= threshold && keyOut < sineTH)
                        type = type + "Sine";
                    else if (keyOut >= sineTH && keyOut < quadTH)
                        type = type + "Quad";
                    else if (keyOut >= quadTH && keyOut < cubicTH)
                        type = type + "Cubic";
                    else if (keyOut >= cubicTH && keyOut < quartTH)
                        type = type + "Quart";
                    else if (keyOut >= quartTH && keyOut < quintTH)
                        type = type + "Quint";
                    else if (keyOut >= quintTH && keyOut < expoTH)
                        type = type + "Expo";
                    else if (keyOut >= expoTH && keyOut < circTH)
                        type = type + "Circ";
                    else if (keyOut >= circTH && keyOut < backTH)
                        type = type + "Back";
                    else if (keyOut >= backTH)
                        type = type + "Back";
                }
                else type = "None";
                break;
            case "InOut":
                if (prop.keyInInterpolationType(k) == 6613 && prop.keyOutInterpolationType(k) == 6613) {
                    if (keyIn < 5 && keyOut < 5)
                        type = "None";
                    else if ((keyIn >= threshold && keyIn < sineTH) && (keyOut >= threshold && keyOut < sineTH))
                        type = type + "Sine";
                    else if ((keyIn >= sineTH && keyIn < quadTH) && (keyOut >= sineTH && keyOut < quadTH))
                        type = type + "Quad";
                    else if ((keyIn >= quadTH && keyIn < cubicTH) && (keyOut >= quadTH && keyOut < cubicTH))
                        type = type + "Cubic";
                    else if ((keyIn >= cubicTH && keyIn < quartTH) && (keyOut >= cubicTH && keyOut < quartTH))
                        type = type + "Quart";
                    else if ((keyIn >= quartTH && keyIn < quintTH) && (keyOut >= quartTH && keyOut < quintTH))
                        type = type + "Quint";
                    else if ((keyIn >= quintTH && keyIn < expoTH) && (keyOut >= quintTH && keyOut < expoTH))
                        type = type + "Expo";
                    else if ((keyIn >= expoTH && keyIn < circTH) && (keyOut >= expoTH && keyOut < circTH))
                        type = type + "Circ";
                    else if ((keyIn >= circTH && keyIn < backTH) && (keyOut >= circTH && keyOut < backTH))
                        type = type + "Back";
                    else if (keyIn >= backTH && keyOut >= backTH)
                        type = type + "Back";
                    else type = type + "Sine";
                }
                else type = "None";
                break;
            default:
                type = "None";
                break;
        }
        return type;
    }
    else return "None";
}

function keyInfluence(prop, k) {
    // - ThreeD = 6414
    // - ThreeD_SPATIAL = 6413
    // - TwoD = 6416
    // - TwoD_SPATIAL = 6415
    // - OneD = 6417

    var kIn;
    var kOut;
    var speedIn;
    var speedOut;
    var influenceIn;
    var influenceOut;
    var influence = [];

    try {
        switch (prop.propertyValueType) {
            case 6414:
                kIn = prop.keyInTemporalEase(k);
                influenceIn = kIn[0].influence;
                speedIn = kIn[0].speed;
                kOut = prop.keyOutTemporalEase(k);
                influenceOut = kOut[0].influence;
                speedOut = kOut[0].speed;

                influence.push(influenceIn);
                influence.push(influenceOut);
                influence.push(speedIn);
                influence.push(speedOut);
                break;
            case 6413:
                kIn = prop.keyInSpatialTangent(k);
                influenceIn = kIn[0].influence;
                speedIn = kIn[0].speed;
                kOut = prop.keyOutSpatialTangent(k);
                influenceOut = kOut[0].influence;
                speedOut = kOut[0].speed;

                influence.push(influenceIn);
                influence.push(influenceOut);
                influence.push(speedIn);
                influence.push(speedOut);
                break;
            case 6416:
                kIn = prop.keyInTemporalEase(k);
                influenceIn = kIn[0].influence;
                speedIn = kIn[0].speed;
                kOut = prop.keyOutTemporalEase(k);
                influenceOut = kOut[0].influence;
                speedOut = kOut[0].speed;

                influence.push(influenceIn);
                influence.push(influenceOut);
                influence.push(speedIn);
                influence.push(speedOut);
                break;
            case 6415:
                kIn = prop.keyInSpatialTangent(k);
                influenceIn = kIn[0].influence;
                speedIn = kIn[0].speed;
                kOut = prop.keyOutSpatialTangent(k);
                influenceOut = kOut[0].influence;
                speedOut = kOut[0].speed;

                influence.push(influenceIn);
                influence.push(influenceOut);
                influence.push(speedIn);
                influence.push(speedOut);
                break;
            case 6417:
                kIn = prop.keyInTemporalEase(k);
                influenceIn = kIn[0].influence;
                speedIn = kIn[0].speed;
                kOut = prop.keyOutTemporalEase(k);
                influenceOut = kOut[0].influence;
                speedOut = kOut[0].speed;

                influence.push(influenceIn);
                influence.push(influenceOut);
                influence.push(speedIn);
                influence.push(speedOut);
                break;
        }
    }
    catch (e) { }
    return influence;
}

function keyInfluenceBefore(prop, k) {
    // - ThreeD = 6414
    // - ThreeD_SPATIAL = 6413
    // - TwoD = 6416
    // - TwoD_SPATIAL = 6415
    // - OneD = 6417

    var k2 = k - 1;

    var kIn2;
    var kOut2;
    var speedIn2;
    var speedOut2;
    var influenceIn2;
    var influenceOut2;
    var influence2 = [];

    try {
        switch (prop.propertyValueType) {
            case 6414:
                if (k2 > 1) {
                    kIn2 = prop.keyInTemporalEase(k2);
                    influenceIn2 = kIn2[0].influence2;
                    speedIn2 = kIn2[0].speed;
                    kOut2 = prop.keyOutTemporalEase(k2);
                    influenceOut2 = kOut2[0].influence;
                    speedOut2 = kOut2[0].speed;

                    influence2.push(influenceIn2);
                    influence2.push(influenceOut2);
                    influence2.push(speedIn2);
                    influence2.push(speedOut2);
                }
                break;
            case 6413:
                if (k2 > 1) {
                    kIn2 = prop.keyInSpatialTangent(k2);
                    influenceIn2 = kIn2[0].influence;
                    speedIn2 = kIn2[0].speed;
                    kOut2 = prop.keyOutSpatialTangent(k2);
                    influenceOut2 = kOut2[0].influence;
                    speedOut2 = kOut2[0].speed;

                    influence2.push(influenceIn2);
                    influence2.push(influenceOut2);
                    influence2.push(speedIn2);
                    influence2.push(speedOut2);
                }
                break;
            case 6416:
                if (k2 > 1) {
                    kIn2 = prop.keyInTemporalEase(k2);
                    influenceIn2 = kIn2[0].influence;
                    speedIn2 = kIn2[0].speed;
                    kOut2 = prop.keyOutTemporalEase(k2);
                    influenceOut2 = kOut2[0].influence;
                    speedOut2 = kOut2[0].speed;

                    influence2.push(influenceIn2);
                    influence2.push(influenceOut2);
                    influence2.push(speedIn2);
                    influence2.push(speedOut2);
                }
                break;
            case 6415:
                if (k2 > 1) {
                    kIn2 = prop.keyInSpatialTangent(k2);
                    influenceIn2 = kIn2[0].influence;
                    speedIn2 = kIn2[0].speed;
                    kOut2 = prop.keyOutSpatialTangent(k2);
                    influenceOut2 = kOut2[0].influence;
                    speedOut2 = kOut2[0].speed;

                    influence2.push(influenceIn2);
                    influence2.push(influenceOut2);
                    influence2.push(speedIn2);
                    influence2.push(speedOut2);
                }
                break;
            case 6417:
                if (k2 > 1) {
                    kIn2 = prop.keyInTemporalEase(k2);
                    influenceIn2 = kIn2[0].influence;
                    speedIn2 = kIn2[0].speed;
                    kOut2 = prop.keyOutTemporalEase(k2);
                    influenceOut2 = kOut2[0].influence;
                    speedOut2 = kOut2[0].speed;

                    influence2.push(influenceIn2);
                    influence2.push(influenceOut2);
                    influence2.push(speedIn2);
                    influence2.push(speedOut2);
                }
                break;
        }
    }
    catch (e) { }
    return influence2;
}

function keyInfluenceAfter(prop, k) {
    // - ThreeD = 6414
    // - ThreeD_SPATIAL = 6413
    // - TwoD = 6416
    // - TwoD_SPATIAL = 6415
    // - OneD = 6417

    var k2 = k + 1;
    var keyCount = prop.numKeys;

    var kIn2;
    var kOut2;
    var speedIn2;
    var speedOut2;
    var influenceIn2;
    var influenceOut2;
    var influence2 = [];

    try {
        switch (prop.propertyValueType) {
            case 6414:
                if (k2 < keyCount) {
                    kIn2 = prop.keyInTemporalEase(k2);
                    influenceIn2 = kIn2[0].influence2;
                    speedIn2 = kIn2[0].speed;
                    kOut2 = prop.keyOutTemporalEase(k2);
                    influenceOut2 = kOut2[0].influence;
                    speedOut2 = kOut2[0].speed;

                    influence2.push(influenceIn2);
                    influence2.push(influenceOut2);
                    influence2.push(speedIn2);
                    influence2.push(speedOut2);
                }
                break;
            case 6413:
                if (k2 < keyCount) {
                    kIn2 = prop.keyInSpatialTangent(k2);
                    influenceIn2 = kIn2[0].influence;
                    speedIn2 = kIn2[0].speed;
                    kOut2 = prop.keyOutSpatialTangent(k2);
                    influenceOut2 = kOut2[0].influence;
                    speedOut2 = kOut2[0].speed;

                    influence2.push(influenceIn2);
                    influence2.push(influenceOut2);
                    influence2.push(speedIn2);
                    influence2.push(speedOut2);
                }
                break;
            case 6416:
                if (k2 < keyCount) {
                    kIn2 = prop.keyInTemporalEase(k2);
                    influenceIn2 = kIn2[0].influence;
                    speedIn2 = kIn2[0].speed;
                    kOut2 = prop.keyOutTemporalEase(k2);
                    influenceOut2 = kOut2[0].influence;
                    speedOut2 = kOut2[0].speed;

                    influence2.push(influenceIn2);
                    influence2.push(influenceOut2);
                    influence2.push(speedIn2);
                    influence2.push(speedOut2);
                }
                break;
            case 6415:
                if (k2 < keyCount) {
                    kIn2 = prop.keyInSpatialTangent(k2);
                    influenceIn2 = kIn2[0].influence;
                    speedIn2 = kIn2[0].speed;
                    kOut2 = prop.keyOutSpatialTangent(k2);
                    influenceOut2 = kOut2[0].influence;
                    speedOut2 = kOut2[0].speed;

                    influence2.push(influenceIn2);
                    influence2.push(influenceOut2);
                    influence2.push(speedIn2);
                    influence2.push(speedOut2);
                }
                break;
            case 6417:
                if (k2 < keyCount) {
                    kIn2 = prop.keyInTemporalEase(k2);
                    influenceIn2 = kIn2[0].influence;
                    speedIn2 = kIn2[0].speed;
                    kOut2 = prop.keyOutTemporalEase(k2);
                    influenceOut2 = kOut2[0].influence;
                    speedOut2 = kOut2[0].speed;

                    influence2.push(influenceIn2);
                    influence2.push(influenceOut2);
                    influence2.push(speedIn2);
                    influence2.push(speedOut2);
                }
                break;
        }
    }
    catch (e) { }
    return influence2;
}

function checkHoldKeyframe(prop, k) {
    // keyInInterpolationType & keyOutInterpolationType::::::::::::::::
    // - BEZIER = 6613
    // - HOLD = 6614
    // - LINEAR = 6612
    var offset = 10 / 1000;
    var nextKey = k + 1;
    if (prop.keyInInterpolationType(k) == 6614 || prop.keyOutInterpolationType(k) == 6614) {
        if (prop.numKeys > k) {
            var newKeyIndex = 1;
            var k2 = prop.addKey(prop.keyTime(nextKey) - offset);

            prop.setValueAtKey(k2, prop.keyValue(k)); newKeyIndex = k2;
            prop.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.LINEAR);

            return newKeyIndex;
        }
        else return false;
    }
    else return false;
}