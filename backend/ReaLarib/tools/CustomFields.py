from django.core import checks, exceptions
from django.db import models
import json
import re


class StateField(models.TextField):
    def __init__(self, *args, **kwargs):
        self.state_choices = kwargs.pop('state_choices', None)
        self.state_instance = kwargs.pop('state_instance', None)
        super().__init__(*args, **kwargs)

    def check(self, **kwargs):
        return [
            *super().check(**kwargs),
            *self._check_state_choices_attribute(**kwargs),
            *self._check_state_instance_attribute(**kwargs)
        ]

    def _check_state_choices_attribute(self, **kwargs):
        if self.state_choices is None:
            return []
        elif not isinstance(self.state_choices, list):
            return [
                checks.Error(
                    "'state_choices' must be a list of str.",
                    obj=self,
                    id='',
                )
            ]
        else:
            for val in self.state_choices:
                if not isinstance(val, str):
                    return [
                        checks.Error(
                            "'state_choices' must be a list of str.",
                            obj=self,
                            id='',
                        )
                    ]
            return []

    def _check_state_instance_attribute(self, **kwargs):
        if self.state_instance is None:
            return []
        elif not isinstance(self.state_instance, type):
            return [
                checks.Error(
                    "'state_instance' must be a type (like \'int\')",
                    obj=self,
                    id='',
                )
            ]
        else:
            return []

    def check_state_value(self, value):
        if self.state_choices and len(self.state_choices) > 0:
            if value not in self.state_choices:
                return False
        if self.state_instance:
            return isinstance(value, self.state_instance)
        return True

    def value_choice_error(self, val):
        if self.state_choices and len(self.state_choices) > 0:
            return 'La valeur de cet état (' + val \
                   + ') est incorrect, il doit être dans la liste ' + str(self.state_choices)
        elif self.state_instance:
            return 'La valeur de cet état (' + val \
                   + ') est incorrect, il doit être du type ' + str(self.state_instance)
        else:
            return 'Erreur de raison inconnue pour cet état (' + self.name + ')'

    def validate(self, value, model_instance):
        super().validate(value, model_instance)
        if not isinstance(value, dict):
            try:
                value = dict(json.loads(value))
            except json.JSONDecodeError as e:
                raise exceptions.ValidationError('Le format des états par jour pour cet état est incorrect,'
                                                 'il doit être un dict({J1: ..}) ou Json. ' + e.msg,
                                                 code='invalid_choice',
                                                 params={'value': str(value)},
                                                 )
        key_pattern = re.compile("J[1-9][0-9]?$")
        for k, i in value.items():
            if not key_pattern.match(k):
                raise exceptions.ValidationError(
                    'Le format des jours est incorrect, il doit être du type \'J11\'',
                    code='invalid_choice',
                    params={'value': k},
                )
            elif not self.check_state_value(i):
                raise exceptions.ValidationError(
                    self.value_choice_error(i),
                    code='invalid_choice',
                    params={'value': i},
                )

    def to_python(self, value):
        if isinstance(value, str):
            value = json.loads(value)
        return json.dumps(value)

    def clean(self, value, model_instance):
        """
        Convert the value's type and run validation. Validation errors
        from to_python() and validate() are propagated. Return the correct
        value if no error is raised.
        """
        self.validate(value, model_instance)
        value = self.to_python(value)
        self.run_validators(value)
        return value
