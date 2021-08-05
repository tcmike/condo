import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Select, Input, Col, Form } from 'antd'
const { Option } = Select
import { useApolloClient } from '@core/next/apollo'
import { useIntl } from '@core/next/intl'


import { uniqBy, isEmpty, find, pick, get } from 'lodash'
import { ClassifiersQueryLocal, ClassifiersQueryRemote, TicketClassifierTypes } from '@condo/domains/ticket/utils/clientSchema/classifierSearch'
import { useTicketValidations } from '@condo/domains/ticket/components/BaseTicketForm/useTicketValidations'

interface Options {
    id: string
    name: string
}
interface ITicketThreeLevelsClassifierHookInput {
    initialValues: {
        classifierRule: string
        placeClassifier: string
        categoryClassifier: string
        descriptionClassifier?: string
    }
}
interface ITicketThreeLevelsClassifierHookOutput {
    ClassifiersEditorComponent: React.FC<{ form, disabled }>
}

interface ITicketClassifierSelectHookInput {
    onChange: (id: string) => void
    onSearch: (id: string) => void
    initialValue: string | null
}

type ClassifierSelectComponent = React.FC<{ disabled?: boolean, style?: React.CSSProperties, value?: string }>
interface ITicketClassifierSelectHookOutput {
    set: {
        all: React.Dispatch<React.SetStateAction<Options[]>>
        one: React.Dispatch<React.SetStateAction<string>>
        search: React.Dispatch<React.SetStateAction<Options[]>>
    }
    SelectComponent: ClassifierSelectComponent
    ref: React.MutableRefObject<HTMLSelectElement>
}

const useTicketClassifierSelectHook = ({
    onChange,
    onSearch,
    initialValue,
}: ITicketClassifierSelectHookInput): ITicketClassifierSelectHookOutput => {
    const [selected, setSelected] = useState<string>(null)
    const [classifiers, setClassifiersFromRules] = useState<Options[]>([])
    const [searchClassifiers, setSearchClassifiers] = useState<Options[]>([])
    const classifiersRef = useRef<HTMLSelectElement>(null)
    const optionsRef = useRef<Options[]>([])

    const setClassifiers = (classifiers) => {
        setClassifiersFromRules(classifiers)
        // We need to remove search classifiers when rules start to work
        setSearchClassifiers([])
    }

    useEffect(() => {
        optionsRef.current = uniqBy([...classifiers, ...searchClassifiers], 'id')
    }, [classifiers, searchClassifiers])

    const SelectComponent = useMemo(() => {
        const SelectComponentWrapper: ClassifierSelectComponent = (props) => {
            const { disabled, style } = props
            return (
                <Select
                    showSearch
                    style={style}
                    allowClear={true}
                    onSelect={onChange}
                    onSearch={onSearch}
                    onClear={() => onChange(null)}
                    optionFilterProp={'title'}
                    defaultActiveFirstOption={false}
                    disabled={disabled}
                    defaultValue={initialValue}
                    ref={classifiersRef}
                    showAction={['focus', 'click']}
                >
                    {
                        optionsRef.current.map(classifier => (
                            <Option value={classifier.id} key={classifier.id} title={classifier.name}>{classifier.name}</Option>
                        ))
                    }

                </Select>
            )
        }
        return SelectComponentWrapper
    }, [initialValue, onSearch, onChange])

    return {
        SelectComponent,
        set: {
            all: setClassifiers,
            one: setSelected,
            search: setSearchClassifiers,
        },
        ref: classifiersRef,
    }
}

export const useTicketThreeLevelsClassifierHook = ({ initialValues: {
    classifierRule,
    placeClassifier,
    categoryClassifier,
    descriptionClassifier,
} }: ITicketThreeLevelsClassifierHookInput): ITicketThreeLevelsClassifierHookOutput => {
    const intl = useIntl()
    const PlaceClassifierLabel = intl.formatMessage({ id: 'component.ticketclassifier.PlaceLabel' })
    const CategoryClassifierLabel = intl.formatMessage({ id: 'component.ticketclassifier.CategoryLabel' })
    const DescriptionClassifierLabel = intl.formatMessage({ id: 'component.ticketclassifier.DescriptionLabel' })
    const ruleRef = useRef({ id: classifierRule, place: null, category:null, description: null })
    const client = useApolloClient()
    const ClassifierLoader = new ClassifiersQueryLocal(client)
    const validations = useTicketValidations()
    const ticketForm = useRef(null)

    const onUserSelect = (id, type) => {
        ruleRef.current = { ...ruleRef.current, [type]: id }
        updateLevels({ [type]: id })
    }
    const onUserSearch = async (input, type) => {
        const classifiers = await ClassifierLoader.search(input, type)
        Setter[type].search(classifiers)
    }

    const {
        set: descriptionSet,
        SelectComponent: DescriptionSelect,
    } = useTicketClassifierSelectHook({
        onChange: (id) => onUserSelect(id, TicketClassifierTypes.description),
        onSearch: (id) => onUserSearch(id, TicketClassifierTypes.description),
        initialValue: descriptionClassifier,
    })

    const {
        set: categorySet,
        SelectComponent: CategorySelect,
        ref: categoryRef,
    } = useTicketClassifierSelectHook({
        onChange: (id) => onUserSelect(id, TicketClassifierTypes.category),
        onSearch: (id) => onUserSearch(id, TicketClassifierTypes.category),
        initialValue: categoryClassifier,
    })

    const {
        set: placeSet,
        SelectComponent: PlaceSelect,
        ref: placeRef,
    } = useTicketClassifierSelectHook({
        onChange: (id) => onUserSelect(id, TicketClassifierTypes.place),
        onSearch: (id) => onUserSearch(id, TicketClassifierTypes.place),
        initialValue: placeClassifier,
    })

    const Setter = {
        place: placeSet,
        category: categorySet,
        description: descriptionSet,
    }

    useEffect(() => {
        ClassifierLoader.init().then(() => {
            if (ruleRef.current.id) {
                ClassifierLoader.findRules({ id: ruleRef.current.id }).then(([rule]) => {
                    const { place, category, description } = rule
                    ruleRef.current = { ...ruleRef.current, ...{ place: place.id, category: category.id, description: get(description, 'id', null) } }
                    updateLevels(ruleRef.current)
                })
            } else {
                // fill options on empty classifier
                [TicketClassifierTypes.place, TicketClassifierTypes.category].forEach(type => {
                    ClassifierLoader.search('', type).then(classifiers => {
                        Setter[type].all(classifiers)
                    })
                })
            }
        })
        return () => {
            // clear all loaded data from helper
            ClassifierLoader.clear()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadLevels = async () => {
        const { place, category, description } = ruleRef.current
        const loadedRules = await Promise.all([
            { category, description, type: 'place' },
            { place, description, type: 'category' },
            { place, category, type: 'description' },
        ].map(selector => {
            const { type, ...querySelectors } = selector
            return new Promise<[string, Options[]]>(resolve => {
                const query = {}
                for (const key in querySelectors) {
                    if (querySelectors[key]) {
                        query[key] = { id: querySelectors[key] }
                    }
                }
                ClassifierLoader.findRules(query).then(data => resolve([type, ClassifierLoader.rulesToOptions(data, type)]))
            })
        }))
        const result = Object.fromEntries(loadedRules)
        return result
    }

    const openSelect = (ref) => {
        if (ref.current) {
            ref.current.blur()
            setTimeout(ref.current.focus, 0)
        }
    }

    const updateRuleId = async () => {
        const querySelectors = pick(ruleRef.current, ['place', 'category', 'description'])
        const query = {}
        for (const key in querySelectors) {
            if (querySelectors[key]) {
                query[key] = { id: querySelectors[key] }
            }
        }
        const matchingRules = await ClassifierLoader.findRules(query)
        if (matchingRules.length === 1) {
            ruleRef.current = { ...ruleRef.current, id: matchingRules[0].id }
        } else if (ruleRef.current.place && ruleRef.current.category) {
            const withEmptyDescription = find(matchingRules, { description: null })
            if (withEmptyDescription){
                ruleRef.current = { ...ruleRef.current, id: withEmptyDescription.id }
            }
        }
        ticketForm.current.setFields([
            { name: 'classifierRule', value: ruleRef.current.id },
            { name: 'placeClassifier', value: ruleRef.current.place },
            { name: 'categoryClassifier', value: ruleRef.current.category },
            { name: 'descriptionClassifier', value: ruleRef.current.description },
        ])
    }

    const updateLevels = async (selected = {}, maxUpdates = 2 ) => {
        ruleRef.current = { ...ruleRef.current, ...selected }
        const options = await loadLevels()
        const state = ruleRef.current
        const updateEmptyState = {}
        Object.keys(Setter).forEach(type => {
            const isExisted = options[type].find(option => option.id === state[type])
            if (!isExisted && state[type]) {
                updateEmptyState[type] = null
            }
        })
        if (!isEmpty(updateEmptyState)) {
            // we need to rebuild all options except selected
            ruleRef.current = { ...ruleRef.current, ...updateEmptyState, id: null, ...selected }
            if (maxUpdates > 0) {
                return await updateLevels(selected, --maxUpdates)
            }
        }
        Object.keys(Setter).forEach(type => {
            Setter[type].all(options[type])
            const isExisted = options[type].find(option => option.id === state[type])
            Setter[type].one(isExisted ? state[type] : null)
        })
        await updateRuleId()
        if (!state.place && state.category) {
            openSelect(placeRef)
        } else if (!state.category && state.place) {
            openSelect(categoryRef)
        }
    }


    const ClassifiersEditorComponent = useMemo(() => {
        const ClassifiersEditorWrapper: React.FC<{ form, disabled }> = ({ form, disabled }) => {
            ticketForm.current = form
            return (
                <>
                    <Form.Item name={'classifierRule'} rules={validations.classifierRule} noStyle={true}>
                        <Input type='hidden'></Input>
                    </Form.Item>
                    <Col span={12} style={{ paddingRight: '20px' }}>
                        <Form.Item label={PlaceClassifierLabel} name={'placeClassifier'} rules={validations.placeClassifier}>
                            <PlaceSelect disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={12} style={{ paddingLeft: '20px' }}>
                        <Form.Item label={CategoryClassifierLabel} name={'categoryClassifier'} rules={validations.categoryClassifier}>
                            <CategorySelect disabled={disabled} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name={'descriptionClassifier'}  label={DescriptionClassifierLabel}>
                            <DescriptionSelect disabled={disabled} />
                        </Form.Item>
                    </Col>
                </>
            )
        }
        return ClassifiersEditorWrapper
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        ClassifiersEditorComponent,
    }
}
