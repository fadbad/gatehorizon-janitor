import React from "react";
import { TextInput } from "react-native";

export function createNumberMask(props) {
    const {
        delimiter = ".",
        precision = 2,
        prefix = [],
        separator = ",",
    } = props || {};

    return (value) => {
        const numericValue = value?.replace(/\D+/g, "") || "";

        let mask = numericValue.split("").map(() => /\d/);

        if (mask.length > precision && precision && separator) {
            mask.splice(-precision, 0, separator);
        }

        const delimiters = Math.ceil((numericValue.length - precision) / 3) - 1;

        if (delimiter) {
            for (let i = 0; i < delimiters; i++) {
                const precisionOffset = precision;
                const separatorOffset = separator ? 1 : 0;
                const thousandOffset = 3 + (delimiter ? 1 : 0);
                const position =
                    -precisionOffset - separatorOffset - i * thousandOffset - 3;
                mask.splice(position, 0, delimiter);
            }
        }

        return [...prefix, ...mask];
    };
}

export function formatWithMask(props) {
    const { text, mask, obfuscationCharacter = "*" } = props;

    // make sure it'll not break with null or undefined inputs
    if (!text) return { masked: "", unmasked: "", obfuscated: "" };
    if (!mask)
        return {
            masked: text || "",
            unmasked: text || "",
            obfuscated: text || "",
        };

    let maskArray = typeof mask === "function" ? mask(text) : mask;

    let masked = "";
    let obfuscated = "";
    let unmasked = "";

    let maskCharIndex = 0;
    let valueCharIndex = 0;

    while (true) {
        // if mask is ended, break.
        if (maskCharIndex === maskArray.length) {
            break;
        }

        // if value is ended, break.
        if (valueCharIndex === text.length) {
            break;
        }

        let maskChar = maskArray[maskCharIndex];
        let valueChar = text[valueCharIndex];

        // value equals mask: add to masked result and advance on both mask and value indexes
        if (maskChar === valueChar) {
            masked += maskChar;
            obfuscated += maskChar;

            valueCharIndex += 1;
            maskCharIndex += 1;
            continue;
        }

        let unmaskedValueChar = text[valueCharIndex];

        // it's a regex maskChar: let's advance on value index and validate the value within the regex
        if (typeof maskChar === "object") {
            // advance on value index
            valueCharIndex += 1;

            const shouldObsfucateChar = Array.isArray(maskChar);

            const maskCharRegex = Array.isArray(maskChar)
                ? maskChar[0]
                : maskChar;

            const matchRegex = RegExp(maskCharRegex).test(valueChar);

            // value match regex: add to masked and unmasked result and advance on mask index too
            if (matchRegex) {
                masked += valueChar;
                obfuscated += shouldObsfucateChar
                    ? obfuscationCharacter
                    : valueChar;
                unmasked += unmaskedValueChar;

                maskCharIndex += 1;
            }

            continue;
        } else {
            // it's a fixed maskChar: add to maskedResult and advance on mask index
            masked += maskChar;
            obfuscated += maskChar;

            maskCharIndex += 1;
            continue;
        }
    }

    return { masked, unmasked, obfuscated };
}

const BRL_CPF_CNPJ = (text) => {
    const rawValue = text?.replace(/\D+/g, '') || '';
    return rawValue.length <= 11 ? BRL_CPF : BRL_CNPJ;
};
const BRL_CURRENCY = createNumberMask({
    prefix: ['R', '$', ' '],
    separator: ',',
    delimiter: '.',
    precision: 2,
});

export const Masks = {
    BRL_CPF_CNPJ,
    BRL_CURRENCY,
    BRL_CAR_PLATE: [/[a-zA-Z]/, /[a-zA-Z]/, /[a-zA-Z]/, '-', /\d/, /\w/, /\d/, /\d/],
    BRL_CNPJ: [/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'/',/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/],
    BRL_CPF: [/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'-',/\d/,/\d/],
    BRL_PHONE: ['(',/\d/,/\d/,')',' ',/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/,],
    CREDIT_CARD: [/\d/,/\d/,/\d/,/\d/,' ',[/\d/],[/\d/],[/\d/],[/\d/],' ',[/\d/],[/\d/],[/\d/],[/\d/],' ',/\d/,/\d/,/\d/,/\d/],
    DATE_DDMMYYYY: [/[0-3]/, /\d/, '/', /[0-1]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    DATE_YYYYMMDD: [/\d/, /\d/, /\d/, /\d/, '/', /[0-1]/, /\d/, '/', /[0-3]/, /\d/],
    ZIP_CODE: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
    TIME: [/\d/, /\d/, ':', /\d/, /\d/]
}

export default React.forwardRef(function (props, ref) {
    const {
        mask,
        value,
        onChangeText,
        placeholderFillCharacter = "_",
        obfuscationCharacter,
        showObfuscatedValue,
        selection,
        ...rest
    } = props;

    const maskArray = React.useMemo(
        () => (typeof mask === "function" ? mask(value) : mask),
        [mask, value]
    );

    const formattedValueResult = React.useMemo(() => {
        return formatWithMask({
            text: value || "",
            mask,
            obfuscationCharacter,
        });
    }, [mask, obfuscationCharacter, value]);

    const maskHasObfuscation = React.useMemo(
        () =>
            maskArray &&
            !!maskArray.find((maskItem) => Array.isArray(maskItem)),
        [maskArray]
    );

    const isValueObfuscated = React.useMemo(
        () => !!maskHasObfuscation && !!showObfuscatedValue,
        [maskHasObfuscation, showObfuscatedValue]
    );

    const handleChangeText = React.useCallback(
        (text) => {
            let textToFormat = text;

            if (isValueObfuscated) {
                textToFormat = formattedValueResult.masked || "";

                if (textToFormat.length > text.length) {
                    textToFormat = textToFormat.slice(0, -1);
                } else if (textToFormat.length < text.length) {
                    textToFormat = textToFormat + text[text.length - 1];
                }
            }

            const result = formatWithMask({
                text: textToFormat,
                mask,
                obfuscationCharacter,
            });

            onChangeText &&
                onChangeText(result.masked, result.unmasked, result.obfuscated);
        },
        [
            isValueObfuscated,
            mask,
            obfuscationCharacter,
            onChangeText,
            formattedValueResult.masked,
        ]
    );

    const defaultPlaceholder = React.useMemo(() => {
        if (maskArray) {
            return maskArray
                .map((maskChar) => {
                    if (typeof maskChar === "string") {
                        return maskChar;
                    } else {
                        return placeholderFillCharacter;
                    }
                })
                .join("");
        } else {
            return undefined;
        }
    }, [maskArray, placeholderFillCharacter]);

    const inputValue = isValueObfuscated
        ? formattedValueResult.obfuscated
        : formattedValueResult.masked;

    return (
        <TextInput
            placeholder={defaultPlaceholder}
            {...rest}
            value={inputValue}
            selection={
                isValueObfuscated
                    ? { start: inputValue.length, end: inputValue.length }
                    : selection
            }
            onChangeText={handleChangeText}
            ref={ref}
        />
    );
});
