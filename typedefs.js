/**
 * @typedef htmx_config_request
 * Extension hook called during htmx:config:request, before v4 converts FormData to URLSearchParams.
 * Sets the Content-Type header to "application/json" (or leaves it unset for multipart),
 * and snapshots ctx.request.body as ctx.request._jsonOriginalBody for use in htmx_before_request.
 * @param {Element} elt Source element that owns the request
 * @param {{ctx: RequestContext}} detail Event detail containing the request context
 * @returns {void}
 *
 * @typedef htmx_before_request
 * Extension hook called during htmx:before:request, just before fetch() is called.
 * Replaces ctx.request.body with the JSON-encoded string (or FormData for multipart)
 * produced by encodingAlgorithm, using the FormData snapshot stored in htmx_config_request.
 * Is a no-op if ctx.request._jsonOriginalBody is absent (i.e. extension is not enabled on this element).
 * @param {Element} elt Source element that owns the request
 * @param {{ctx: RequestContext}} detail Event detail containing the request context
 * @returns {void}
 *
 * @typedef encodingAlgorithm
 * Encodes FormData into a JSON string (or a FormData object for multipart requests).
 * Iterates over field names derived from the form's elements, applies path parsing
 * for nested keys, and optionally coerces values to their native JS types.
 * @param {FormData} parameters Raw form data snapshot captured before v4's URLSearchParams conversion
 * @param {Element} elt Source element that owns the request
 * @returns {string|FormData} JSON string for standard requests; FormData with "data" and "file" entries for hx-multipart requests
 *
 * @typedef getIncludedElement
 * Resolves the element referenced by hx-include on the source element.
 * Uses api.attributeValue() (which already walks up the DOM) to find the attribute value,
 * then elt.closest() to locate the element carrying it, and htmx.find() to resolve the selector.
 * Replaces the v2 combination of api.getClosestAttributeValue + api.getClosestMatch + api.querySelectorExt.
 * @param {Element} elt Source element that owns the request
 * @returns {Element|undefined} The included element, or undefined if hx-include is not set
 *
 * @typedef prepareRawInputValue
 * Normalises the raw array returned by FormData.getAll() into a scalar, null, or array
 * depending on how many values were found.
 * @param {string[]} value Array of raw string values from FormData.getAll()
 * @returns {string|string[]|null} Single value, array of values, or null if the field was absent
 *
 * @typedef prepareInputValueWithElements
 * Applies element-type-aware defaults to the raw value before type parsing.
 * Ensures a single unchecked checkbox always yields "off", and that select[multiple]
 * and checkbox arrays always yield an array (even when empty or single-valued).
 * @param {string|string[]|null} value Normalised value from prepareRawInputValue
 * @param {NodeList} elements All DOM elements sharing this field name
 * @returns {string|string[]|null} Value adjusted for the element type
 *
 * @typedef getChildrenByName
 * Queries the owning form for all elements with the given field name.
 * Prefers the includedElt's form when hx-include is in use.
 * @param {Element} elt Source element that owns the request
 * @param {Element|undefined} includedElt Element resolved from hx-include, if any
 * @param {string} name Field name to look up
 * @returns {NodeList} All matching form elements
 *
 * @typedef isSelectMultiple
 * Returns true if elements contains exactly one select[multiple].
 * @param {NodeList} elements Form elements sharing a field name
 * @returns {boolean}
 *
 * @typedef isCheckbox
 * Returns true if elements contains exactly one input[type=checkbox].
 * @param {NodeList} elements Form elements sharing a field name
 * @returns {boolean}
 *
 * @typedef isCheckboxArray
 * Returns true if every element in elements is an input[type=checkbox] (and there is at least one).
 * @param {NodeList} elements Form elements sharing a field name
 * @returns {boolean}
 *
 * @typedef parseValues
 * Coerces an already-prepared value to its native JS type by inspecting
 * the corresponding DOM elements. Handles scalar inputs, select[multiple],
 * and checkbox arrays individually.
 * @param {NodeList} elements Form elements sharing this field name
 * @param {Element|undefined} includedElt Element resolved from hx-include, if any
 * @param {string|string[]|boolean|number|null} value Value after prepareInputValueWithElements
 * @returns {string|string[]|boolean|number|null} Value with native JS types applied
 *
 * @typedef parseElementValue
 * Coerces a single scalar value to its native JS type based on the element's type.
 * Handles input[type=checkbox] → boolean, input[type=number|range] → number,
 * and select-one with all-numeric options → number.
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} elt The element owning the value
 * @param {string|null} value Raw string value to coerce
 * @returns {string|boolean|number|null} Coerced value
 *
 * @typedef checkAllPossibleOptionsAreNumbers
 * Checks whether every option value in a <select> element can be coerced to a finite number,
 * used to decide whether select-one results should be returned as numbers.
 * @param {HTMLSelectElement} elt Select element to inspect
 * @returns {boolean}
 *
 * @typedef JSONEncodingPath
 * Parses a field name such as "pet[0][name]" into an ordered list of step descriptors
 * that encodingAlgorithm uses to build the nested output object.
 * Returns a single-step FAILURE descriptor for malformed names.
 * @param {string} name Raw field name from the form element
 * @returns {Array<{type: "object"|"array", key: string|number|null, last: boolean, next_type: "object"|"array"|null}>} Ordered list of nesting instructions
 *
 * @typedef setValueFromPath
 * Applies one step of nesting instruction to the current context object or array,
 * creating intermediate containers as needed and writing the final value at the last step.
 * @param {Object|Array} context The current nesting container being constructed
 * @param {{type: "object"|"array", key: string|number|null, last: boolean, next_type: "object"|"array"|null}} step Nesting instruction for this level
 * @param {*} value The fully-prepared and optionally type-parsed value to write
 * @returns {Object|Array} The next-level container for the following step, or the written value at the last step
 */
